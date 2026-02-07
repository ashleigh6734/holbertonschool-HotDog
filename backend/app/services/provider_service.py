from app.extensions import db
from app.models.service_provider import ServiceProvider, ServiceType
from datetime import time

class ProviderService:
    @staticmethod
    def create_provider(user_id, data):
        # Convert string service_type to Enum if needed
        service_type_str = data.get("service_type")
        if service_type_str:
            try:
                # Matches "Vet Consultations" -> ServiceType.VET_CONSULTATIONS
                service_enum = next(s for s in ServiceType if s.value == service_type_str)
            except StopIteration:
                raise ValueError(f"Invalid service type: {service_type_str}")
        else:
            raise ValueError("Service type is required")

        # Parse times (Frontend sends "09:00", we convert to Python time object)
        opening = data.get("opening_time", "09:00")
        closing = data.get("closing_time", "17:00")
        
        # Helper to convert "HH:MM" string to time object
        def parse_time(t_str):
            h, m = map(int, t_str.split(':'))
            return time(h, m)

        provider = ServiceProvider(
            user_id=user_id,
            name=data.get("name"),
            service_type=service_enum,
            description=data.get("description"),
            address=data.get("address"),
            phone=data.get("phone"),
            email=data.get("email"),
            opening_time=parse_time(opening),
            closing_time=parse_time(closing),
            slot_duration=int(data.get("slot_duration", 30))
        )
        
        db.session.add(provider)
        db.session.commit()
        return provider

    @staticmethod
    def get_all_providers(filters=None):
        query = ServiceProvider.query
        
        if filters:
            # Filter by Service Type (e.g. "Dog Walking")
            if "service_type" in filters:
                st = filters["service_type"]
                # Find the enum that matches the string value
                for enum_member in ServiceType:
                    if enum_member.value == st:
                        query = query.filter(ServiceProvider.service_type == enum_member)
                        break
            
            # Filter by Name (Partial match)
            if "name" in filters:
                query = query.filter(ServiceProvider.name.ilike(f"%{filters['name']}%"))

        return query.all()

    @staticmethod
    def get_provider_by_id(provider_id):
        return db.session.get(ServiceProvider, provider_id)

    @staticmethod
    def update_provider(provider, data):
        # Allow updating simple fields
        if "name" in data: provider.name = data["name"]
        if "description" in data: provider.description = data["description"]
        if "address" in data: provider.address = data["address"]
        if "phone" in data: provider.phone = data["phone"]
        
        # Allow updating availability
        if "slot_duration" in data: 
            provider.slot_duration = int(data["slot_duration"])
            
        db.session.commit()
        return provider