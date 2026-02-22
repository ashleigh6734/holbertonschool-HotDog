from app import create_app
from app.api_routes import providers
from app.extensions import db
from app.models.user import User
from app.models.pet import Pet, SpeciesEnum, GenderEnum
from app.models.service_provider import ServiceProvider, ServiceType, ProviderService
from app.models.appointment import Appointment, AppointmentStatus
from datetime import date, time, datetime, timedelta, timezone

app = create_app()

# ==========================================
# DATA: List of 6 Providers to Seed
# ==========================================
PROVIDERS_DATA = [
    {
        "owner": {"first": "Alice", "last": "Vet", "email": "alice@vet.com"},
        "business": {
            "name": "Paws & Claws Veterinary Clinic",
            "img_url": "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
            "services": [ServiceType.VET_CONSULTATIONS, ServiceType.VACCINATIONS, ServiceType.DESEXING],
            "description": "Comprehensive veterinary care for your furry friends.",
            "address": "123 High St, Melbourne VIC",
            "phone": "+61400111222",
            "email": "contact@pawsclaws.com",
            "slot_duration": 30
        }
    },
    {
        "owner": {"first": "Bob", "last": "Groomer", "email": "bob@grooming.com"},
        "business": {
            "name": "Sparkle Paws Grooming",
            "img_url": "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
            "services": [ServiceType.HAIRCUTS_COAT, ServiceType.NAIL_TRIMMING],
            "description": "Professional grooming services including wash, cut, and style.",
            "address": "45 Dogwood Ln, Sydney NSW",
            "phone": "+61400333444",
            "email": "info@sparklepaws.com",
            "slot_duration": 60
        }
    },
    {
        "owner": {"first": "Charlie", "last": "Walker", "email": "charlie@walks.com"},
        "business": {
            "name": "Happy Tails Dog Walking",
            "img_url": "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
            "services": [ServiceType.DOG_WALKING],
            "description": "Group and solo walks to keep your dog active.",
            "address": "78 Park Ave, Brisbane QLD",
            "phone": "+61400555666",
            "email": "walks@happytails.com",
            "slot_duration": 45
        }
    },
    {
        "owner": {"first": "Diana", "last": "Trainer", "email": "diana@train.com"},
        "business": {
            "name": "Good Boy Puppy School",
            "img_url": "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
            "services": [ServiceType.PUPPY_TRAINING],
            "description": "Obedience training and socialization classes.",
            "address": "101 Training Crt, Perth WA",
            "phone": "+61400777888",
            "email": "train@goodboy.com",
            "slot_duration": 60
        }
    },
    {
        "owner": {"first": "Evan", "last": "Surgeon", "email": "evan@desex.com"},
        "business": {
            "name": "Safe Hands Desexing Clinic",
            "img_url": "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
            "services": [ServiceType.DESEXING],
            "description": "Specialized clinic focusing on safe desexing procedures.",
            "address": "202 Safety Rd, Adelaide SA",
            "phone": "+61400999000",
            "email": "admin@safehands.com",
            "slot_duration": 90
        }
    },
    {
        "owner": {"first": "Fiona", "last": "Dentist", "email": "fiona@teeth.com"},
        "business": {
            "name": "Canine Smiles Dental",
            "img_url": "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
            "services": [ServiceType.DENTAL],
            "description": "Veterinary dentistry including cleaning and scaling.",
            "address": "303 Molar St, Hobart TAS",
            "phone": "+61400123123",
            "email": "smile@caninesmiles.com",
            "slot_duration": 45
        }
    }
]

with app.app_context():
    db.drop_all()
    db.create_all()

    # =====================
    # Seed user
    # =====================
    user1 = User(
        first_name="John",
        last_name="Doe",
        email="john@test.com",
        phone_number="+61412345678"
    )
    user1.set_password("password123")

    user2 = User(
        first_name="Mary",
        last_name="Doe",
        email="mary@test.com",
        phone_number="+61412345628",
        role="provider"
    )
    user2.set_password("password124")

    db.session.add_all([user1, user2])
    db.session.commit() # commit first so user 1 gets an ID


    # =====================
    # Seed pets
    # =====================
    pet1 = Pet(
        owner_id=user1.id,
        name="Butters",
        species=SpeciesEnum.dog,
        breed="mixed",
        gender=GenderEnum.male,
        desexed=True,
        date_of_birth=date(2024, 1, 17),
        weight=28.5,
        notes="Up to date on vaccinations"
    )

    pet2 = Pet(
        owner_id=user1.id,
        name="Snom",
        species=SpeciesEnum.cat,
        breed="bengal",
        gender=GenderEnum.female,
        desexed=True,
        date_of_birth=date(2023, 1, 10),
        weight=4.2,
        notes="Indoor cat"
    )

    db.session.add_all([pet1, pet2])
    db.session.commit()
    # =====================
    # 3. Seed 6 Service Providers
    # =====================
    
    for data in PROVIDERS_DATA:
        # A. Create the User (Business Owner)
        owner = User(
            first_name=data["owner"]["first"],
            last_name=data["owner"]["last"],
            email=data["owner"]["email"],
            role="provider",
            phone_number=data["business"]["phone"]
        )
        owner.set_password("password123")
        db.session.add(owner)
        db.session.flush() # Flush to get the ID before creating the provider

        # B. Create the Service Provider linked to the Owner
        provider = ServiceProvider(
            user_id=owner.id,
            name=data["business"]["name"],
            img_url=data["business"].get("img_url"),
            description=data["business"]["description"],
            address=data["business"]["address"],
            phone=data["business"]["phone"],
            email=data["business"]["email"],
            slot_duration=data["business"]["slot_duration"],
            opening_time=time(9, 0),
            closing_time=time(17, 0)
        )
        owner.service_provider = provider
        db.session.add(provider)
        db.session.flush() # Flush to get provider ID

        # C. Loop through the list and add Services
        if "services" in data["business"]:
            for s_type in data["business"]["services"]:
                new_service = ProviderService(
                    provider_id=provider.id,
                    service_type=s_type
                )
                db.session.add(new_service)

    db.session.commit()
    print("✅ Database seeded successfully with Users, Pets, and 6 Providers!")

    # =====================
    # 4. Seed Appointments for John -- testing Sylvia's manage appointments frontend
    # =====================
    # Can delete these seed data if Crystal creates real bookings / appointments through the frontend.
    
    # Query all providers from database
    providers = ServiceProvider.query.all()
    
    if providers and pet1 and pet2:
        # Create appointments for user1's pets
        # Note: Appointment times are set to on the hour or half past
        appointments = [
            Appointment(
                pet_id=pet1.id,
                provider_id=providers[0].id,  # Paws & Claws Veterinary Clinic
                date_time=datetime.now(timezone.utc).replace(minute=30, second=0, microsecond=0) + timedelta(days=3, hours=10),
                service_type=ServiceType.VET_CONSULTATIONS,
                status=AppointmentStatus.CONFIRMED,
                notes="Check-up for Butters"
            ),
            Appointment(
                pet_id=pet1.id,
                provider_id=providers[1].id,  # Sparkle Paws Grooming
                date_time=datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0) + timedelta(days=5, hours=14),
                service_type=ServiceType.HAIRCUTS_COAT,
                status=AppointmentStatus.CONFIRMED,
                notes="Grooming session"
            ),
            Appointment(
                pet_id=pet2.id,
                provider_id=providers[0].id,  # Paws & Claws Veterinary Clinic
                date_time=datetime.now(timezone.utc).replace(minute=30, second=0, microsecond=0) + timedelta(days=7, hours=11),
                service_type=ServiceType.VET_CONSULTATIONS,
                status=AppointmentStatus.CONFIRMED,
                notes="Annual check-up for Snom"
            ),
            Appointment(
                pet_id=pet1.id,
                provider_id=providers[2].id,  # Happy Tails Dog Walking
                date_time=datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0) + timedelta(days=2, hours=15),
                service_type=ServiceType.DOG_WALKING,
                status=AppointmentStatus.CONFIRMED,
                notes="30-minute walk"
            ),
        ]
        
        db.session.add_all(appointments)
        db.session.commit()
        print("✅ Appointments seeded successfully!")
