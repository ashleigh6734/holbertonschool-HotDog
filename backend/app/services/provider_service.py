from app.extensions import db
from app.models.service_provider import ServiceProvider, ServiceType, ProviderService as ProviderServiceModel
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
    def update_provider(provider, data):
        # Update basic fields
        if "name" in data: provider.name = data["name"]
        if "description" in data: provider.description = data["description"]
        if "address" in data: provider.address = data["address"]
        if "phone" in data: provider.phone = data["phone"]
        if "slot_duration" in data: provider.slot_duration = int(data["slot_duration"])
    
        db.session.commit()
        return provider