from sqlalchemy import func
from app.extensions import db
from app.models.service_provider import ServiceProvider, ServiceType, ProviderService as ProviderServiceModel
from app.models.review import Review
from datetime import time

class ServiceProviderService:
    @staticmethod
    def create_provider(user_id, data):
        # A. Parse Times first
        opening = data.get("opening_time", "09:00")
        closing = data.get("closing_time", "17:00")
        
        def parse_time(t_str):
            h, m = map(int, t_str.split(':'))
            return time(h, m)

        # B. Create the Provider
        provider = ServiceProvider(
            user_id=user_id,
            name=data.get("name"),
            description=data.get("description"),
            address=data.get("address"),
            phone=data.get("phone"),
            email=data.get("email"),
            img_url=data.get("img_url", "https://via.placeholder.com/800x400?text=Clinic+Image"),
            opening_time=parse_time(opening),
            closing_time=parse_time(closing),
            slot_duration=int(data.get("slot_duration", 30))
        )
        
        db.session.add(provider)
        db.session.flush() # Flush to generate the Provider ID
        
        # C. Handle the List of Services
        # Expecting input: "services": ["Vet Consultations", "Desexing"]
        service_list = data.get("services", [])
        
        if not service_list:   
            raise ValueError("At least one service is required")

        for s_str in service_list:
            # 1. Find matching Enum
            service_enum = None
            for s in ServiceType:
                if s.value == s_str:
                    service_enum = s
                    break
            
            if not service_enum:
                raise ValueError(f"Invalid service type: {s_str}")

            # 2. Create the link in the new table
            new_service = ProviderServiceModel(
                provider_id=provider.id,
                service_type=service_enum
            )
            db.session.add(new_service)

        db.session.commit()
        return provider

    @staticmethod
    def get_all_providers(filters=None):
        query = ServiceProvider.query
        
        if filters:
            # 1. Filter by Service Type
            service_type_str = filters.get("service_type")
            
            if service_type_str:
                print(f"DEBUG: Searching for service_type='{service_type_str}'")
                
                # Find the Enum
                found_enum = None
                for enum_member in ServiceType:
                    if enum_member.value == service_type_str:
                        found_enum = enum_member
                        break
                
                if found_enum:
                    # JOIN the new table to filter
                    query = query.join(ProviderServiceModel).filter(
                        ProviderServiceModel.service_type == found_enum
                    )
                else:
                    print("DEBUG: No matching Enum found.")
                    return [] # Return empty if invalid service searched

            # 2. Filter by Name
            name_str = filters.get("name")
            if name_str:
                query = query.filter(ServiceProvider.name.ilike(f"%{name_str}%"))

        return query.all()

    @staticmethod
    def get_provider_by_id(provider_id):
        return db.session.get(ServiceProvider, provider_id)

    @staticmethod
    def get_by_owner_id(user_id):
        return ServiceProvider.query.filter_by(user_id=user_id).first()

    @staticmethod
    def update_provider(provider, data):
        # Update basic fields
        if "name" in data: provider.name = data["name"]
        if "description" in data: provider.description = data["description"]
        if "address" in data: provider.address = data["address"]
        if "phone" in data: provider.phone = data["phone"]
        if "slot_duration" in data: provider.slot_duration = int(data["slot_duration"])
        if "img_url" in data: provider.img_url = data["img_url"]
    
        db.session.commit()
        return provider
    
    @staticmethod
    def get_top_rated_providers(limit=6):
        """
        Fetches providers sorted by average rating (highest first).
        Only includes providers with at least one review.
        """
        # 1. Query the database for Provider, Avg Rating, and Count
        results = db.session.query(
            ServiceProvider,
            func.avg(Review.rating).label('avg_rating'),
            func.count(Review.id).label('review_count')
        ).join(Review, ServiceProvider.reviews) \
         .group_by(ServiceProvider.id) \
         .order_by(func.avg(Review.rating).desc()) \
         .limit(limit) \
         .all()

        # 2. Format the output cleanly
        top_rated = []
        for provider, avg_rating, count in results:
            
            # Get the main service to show on the dashboard card
            main_service = "General"
            if provider.services and len(provider.services) > 0:
                main_service = provider.services[0].service_type.value

            provider_data = {
                "id": provider.id,
                "name": provider.name,
                "address": provider.address,
                # Round to 1 decimal place (e.g., 4.7)
                "rating": round(avg_rating, 1), 
                "review_count": count,
                "img_url": provider.img_url,
                "main_service": main_service
            }
            top_rated.append(provider_data)

        return top_rated
    
    @staticmethod
    def get_available_slots(provider_id, target_date_str):
        from datetime import datetime, timedelta, timezone
        from app.models.appointment import Appointment, AppointmentStatus
        
        # 1. Parse the requested date (e.g., '2026-02-17')
        try:
            target_date = datetime.strptime(target_date_str, "%Y-%m-%d").date()
        except ValueError:
            return None, "Invalid date format. Use YYYY-MM-DD."

        # 2. Get the provider
        provider = ServiceProviderService.get_provider_by_id(provider_id)
        if not provider:
            return None, "Provider not found."

        # 3. Create timezone-aware datetimes
        start_of_day = datetime.combine(target_date, datetime.min.time()).replace(tzinfo=timezone.utc)
        end_of_day = datetime.combine(target_date, datetime.max.time()).replace(tzinfo=timezone.utc)

        # 4. Fetch all active appointments for this date
        appointments = Appointment.query.filter(
            Appointment.provider_id == provider_id,
            Appointment.date_time >= start_of_day,
            Appointment.date_time <= end_of_day,
            Appointment.status != AppointmentStatus.CANCELLED
        ).all()

        # 5. Generate the daily schedule
        available_slots = []
        current_time = datetime.combine(target_date, provider.opening_time).replace(tzinfo=timezone.utc)
        closing_time = datetime.combine(target_date, provider.closing_time).replace(tzinfo=timezone.utc)
        slot_duration = timedelta(minutes=provider.slot_duration)

        # 6. Loop through the day and check for overlaps
        while current_time + slot_duration <= closing_time:
            slot_end_time = current_time + slot_duration
            is_booked = False

            for appt in appointments:
                appt_start = appt.date_time
                appt_end = appt_start + slot_duration 

                # If the times overlap, mark as booked
                if current_time < appt_end and slot_end_time > appt_start:
                    is_booked = True
                    break

            if not is_booked:
                # Format to look exactly like UI
                time_string = current_time.strftime("%I:%M%p").lstrip("0")
                available_slots.append(time_string)

            current_time += slot_duration

        return available_slots, None
