import os
from app import create_app
from app.api_routes import providers
from app.extensions import db
from app.models.user import User
from app.models.pet import Pet, SpeciesEnum, GenderEnum
from app.models.service_provider import ServiceProvider, ServiceType, ProviderService
from app.models.appointment import Appointment, AppointmentStatus
from datetime import date, time, datetime, timedelta, timezone
from datetime import datetime
from app.models.review import Review

app = create_app()
IMAGE_BASE_URL = os.getenv("IMAGE_BASE_URL", "http://localhost:5000").rstrip("/")


def static_url(path):
    return f"{IMAGE_BASE_URL}/static/{path.lstrip('/')}"

# ==========================================
# DATA: List of 6 Providers to Seed
# ==========================================
PROVIDERS_DATA = [
    {
        "owner": {"first": "Alice", "last": "Vet", "email": "alice@gmail.com"},
        "business": {
            "name": "Paws & Claws Veterinary Clinic",
            "img_url": static_url("images/bookingImages/paws-and-claws.jpg"),
            "logo_url": "https://i.postimg.cc/2y76xGNF/Logo-Paws-Claws-Veterinary-Clinic.png",
            "services": [ServiceType.VET_CONSULTATIONS, ServiceType.VACCINATIONS, ServiceType.DESEXING],
            "description": "A trusted local veterinary clinic providing general health check-ups, vaccinations, and surgical procedures. Our experienced team is dedicated to keeping pets healthy and supporting owners with professional advice and care.",
            "address": "123 High St, Melbourne VIC",
            "phone": "+61400111222",
            "email": "contact@pawsclaws.com",
            "slot_duration": 30,
            "opening_time": "08:00",
            "closing_time": "17:00"
        }
    },
    {
        "owner": {"first": "Bob", "last": "Groomer", "email": "bob@grooming.com"},
        "business": {
            "name": "Sparkle Paws Grooming",
            "img_url": static_url("images/bookingImages/sparkle-paws-grooming.jpg"),
            "logo_url": "https://i.postimg.cc/FRgNtKC5/Logo-Sparkle-Paws-Grooming.png",
            "services": [ServiceType.HAIRCUTS_COAT, ServiceType.NAIL_TRIMMING],
            "description": "Professional pet grooming services including bathing, coat trimming, nail clipping, and styling. We focus on creating a calm and comfortable experience so every pet leaves looking and feeling their best.",
            "address": "45 Dogwood Ln, Melbourne VIC",
            "phone": "+61400333444",
            "email": "info@sparklepaws.com",
            "slot_duration": 60,
            "opening_time": "09:30",
            "closing_time": "18:00"
        }
    },
    {
        "owner": {"first": "Charlie", "last": "Walker", "email": "charlie@walks.com"},
        "business": {
            "name": "Happy Tails Dog Walking",
            "img_url": static_url("images/bookingImages/dog-walking.jpg"),
            "logo_url": "https://i.postimg.cc/P5gjPDBp/Logo-Happy-Tails-Dog-Walking.png",
            "services": [ServiceType.DOG_WALKING],
            "description": "Reliable dog walking services designed to keep your dog active, social, and happy. We offer both solo and small group walks, ensuring each dog receives plenty of exercise, attention, and outdoor time.",
            "address": "78 Park Ave, Melbourne VIC",
            "phone": "+61400555666",
            "email": "walks@happytails.com",
            "slot_duration": 45,
            "opening_time": "7:00",
            "closing_time": "15:00"
        }
    },
    {
        "owner": {"first": "Diana", "last": "Trainer", "email": "diana@train.com"},
        "business": {
            "name": "Good Boy Puppy School",
            "img_url": static_url("images/bookingImages/puppy-school.jpg"),
            "logo_url": "https://i.postimg.cc/wM4KHRX6/Logo-Good-Boy-Puppy-School.png",
            "services": [ServiceType.PUPPY_TRAINING],
            "description": "Puppy training and socialisation classes designed to build confidence and good behaviour. Our structured sessions help puppies learn essential commands while supporting owners with practical training guidance.",
            "address": "101 Training Crt, Melbourne VIC",
            "phone": "+61400777888",
            "email": "train@goodboy.com",
            "slot_duration": 60,
            "opening_time": "8:00",
            "closing_time": "15:00"
        }
    },
    {
        "owner": {"first": "Evan", "last": "Surgeon", "email": "evan@desex.com"},
        "business": {
            "name": "Safe Hands Desexing Clinic",
            "img_url": static_url("images/bookingImages/desexing.jpg"),
            "logo_url": "https://i.postimg.cc/zGgmZBV8/Logo-Safe-Hands-Desexing-Clinic.png",
            "services": [ServiceType.DESEXING],
            "description": "A specialised clinic focused on safe and professional desexing procedures. Our experienced veterinary team prioritises pet comfort, safety, and post-surgery care for a smooth recovery.",
            "address": "202 Safety Rd, Melbourne VIC",
            "phone": "+61400999000",
            "email": "admin@safehands.com",
            "slot_duration": 90,
            "opening_time": "8:00",
            "closing_time": "17:00"
        }
    },
    {
        "owner": {"first": "Fiona", "last": "Dentist", "email": "fiona@teeth.com"},
        "business": {
            "name": "Canine Smiles Dental",
            "img_url": static_url("images/bookingImages/dental-smiles.jpg"),
            "logo_url": "https://i.postimg.cc/90MSxXvn/Logo-Canine-Smiles-Dental.png",
            "services": [ServiceType.DENTAL],
            "description": "Veterinary dental services including professional cleaning, scaling, and oral health assessments. We help prevent dental disease and keep your pet’s teeth and gums healthy.",
            "address": "303 Molar St, Melbourne VIC",
            "phone": "+61400123123",
            "email": "smile@caninesmiles.com",
            "slot_duration": 45,
            "opening_time": "9:00",
            "closing_time": "17:00"
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
        first_name="Bad",
        last_name="Bunny",
        email="badbunny@gmail.com",
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

    user3 = User(
        first_name="Cardi",
        last_name="B",
        email="cardib@test.com",
        phone_number="+61412345629",
        role="user"
    )
    user3.set_password("password123")

    db.session.add_all([user1, user2, user3])
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
        notes="No known health issues. Up to date on vaccinations - next vaccination date 27/02/2027",
        medical_notes="Mild skin allergy observed. Monitor diet.",
        img_url=static_url("images/petImages/butters.jpg")
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
        notes="Indoor cat. Spayed/neutered and microchipped. ",
        medical_notes="Dental cleaning recommended next visit.",
        img_url=static_url("images/petImages/snom.jpg")
    )

    pet3 = Pet(
        owner_id=user2.id,
        name="Nugget",
        species=SpeciesEnum.dog,
        breed="mixed",
        gender=GenderEnum.male,
        desexed=False,
        date_of_birth=date(2017, 1, 11),
        weight=8.5,
        notes="Friendly dog but hates walks. Food motivated. ",
        medical_notes="Behavioural anxiety during grooming.",
        img_url=static_url("images/petImages/nugget.jpeg")
    )

    pet4 = Pet(
        owner_id=user3.id,
        name="Crumpet",
        species=SpeciesEnum.cat,
        breed="domestic_longhair",
        gender=GenderEnum.female,
        desexed=False,
        date_of_birth=date(2026, 2, 14),
        weight=10,
        notes="Only eats sashimi. Frequent furballs.",
        medical_notes="Healthy cat - no issues.",
        img_url=""
    )

    # pet5 = Pet(
    #     owner_id=user1.id, #Bad Bunny
    #     name="Peanut",
    #     species=SpeciesEnum.dog,
    #     breed="mixed",
    #     gender=GenderEnum.male,
    #     desexed=True,
    #     date_of_birth=date(2014, 2, 14),
    #     weight=12,
    #     notes="Adopted last week - requires initial check up. Am concerned about rashes on his paws and areas of skin.",
    #     medical_notes="Mild skin allergy observed. Monitor diet.",
    #     img_url=""
    # )

    db.session.add_all([pet1, pet2, pet3, pet4])  # remember to add in pet5 when re-seeding for Review Demo -> refer also to line 284
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
        opening_time_str = data["business"]["opening_time"]
        closing_time_str = data["business"]["closing_time"]

        provider = ServiceProvider(
            user_id=owner.id,
            name=data["business"]["name"],
            img_url=data["business"].get("img_url"),
            logo_url=data["business"].get("logo_url"),
            description=data["business"]["description"],
            address=data["business"]["address"],
            phone=data["business"]["phone"],
            email=data["business"]["email"],
            slot_duration=data["business"]["slot_duration"],
            opening_time=datetime.strptime(opening_time_str, "%H:%M").time(),
            closing_time=datetime.strptime(closing_time_str, "%H:%M").time()
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
    # 4. Seed Appointments 
    # =====================
    # Query all providers from database
    providers = ServiceProvider.query.all()
    
    if providers and pet1 and pet2 and pet3 and pet4: #REMEMBER TO ADD IN pet5 FOR REVIEW DEMO
        # Create appointments for user1's pets
        # Note: Appointment times are set to on the hour or half past
        appointments = [
            Appointment(
                pet_id=pet1.id, #butters
                provider_id=providers[1].id,  # Sparkle Paws Grooming
                date_time=datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0) + timedelta(days=5, hours=14),
                service_type=ServiceType.HAIRCUTS_COAT,
                status=AppointmentStatus.CONFIRMED,
                notes="Grooming session"
            ),
            Appointment(
                pet_id=pet2.id, #snom
                provider_id=providers[5].id,  # Canine Smiles Dental
                date_time=datetime.now(timezone.utc) + timedelta(days=3), # 3 days ago
                service_type=ServiceType.DENTAL,
                status=AppointmentStatus.COMPLETED,
                notes="Routine dental scaling and cleaning completed."
            ),
            Appointment(
                pet_id=pet4.id, #crumpet
                provider_id=providers[0].id,  # Paws and Claws
                date_time=datetime.now(timezone.utc) - timedelta(days=2), # 2 days ago
                service_type=ServiceType.VACCINATIONS,
                status=AppointmentStatus.COMPLETED,
                notes="Up to date on vaccinations - next check up 16/04/2026"
            ),
            Appointment(
                pet_id=pet3.id, #nugget
                provider_id=providers[0].id,  # Paws and Claws
                date_time=datetime.now(timezone.utc) + timedelta(days=1), # in 1 day
                service_type=ServiceType.VET_CONSULTATIONS,
                status=AppointmentStatus.CONFIRMED,
                notes="Nugget is slightly over healthy weight. Check in at next appointment."
            ),
            Appointment(
                pet_id=pet3.id, #nugget
                provider_id=providers[0].id,  # Paws and Claws
                date_time=datetime.now(timezone.utc) - timedelta(days=6), # 6 days in the past, to show repeat clients
                service_type=ServiceType.VET_CONSULTATIONS,
                status=AppointmentStatus.COMPLETED,
                notes="Nugget is slightly over healthy weight. Check in at next appointment."
            ),
            # Bad Bunny (user1) completed appointment at Paws and Claws (providers[0]) for Peanut (pet5)
            # Appointment(
            #     pet_id=pet5.id, #Peanut
            #     provider_id=providers[0].id,  # Paws and Claws
            #     date_time=datetime.now(timezone.utc) - timedelta(days=7), # 1 week ago
            #     service_type=ServiceType.VET_CONSULTATIONS,
            #     status=AppointmentStatus.COMPLETED,
            #     notes="No major concerns, however has a mild allergy to peanuts which is causing his itchy rashes. Appointment to be booked next week for follow up."
            # ),   
        ]
        
        db.session.add_all(appointments)
        db.session.commit()
        print("✅ Appointments seeded successfully")
        
    # =====================
    # 5. Seed Reviews 
    # =====================

    if appointments and len(appointments) >= 2:
        test_reviews = [
            # Link this review to the first appointment (Paws & Claws - Cardi B)
            Review(
                provider_id=appointments[2].provider_id,
                user_id=appointments[2].pet.owner_id,
                appointment_id=appointments[2].id,
                rating=5,
                comment="Absolutely the best care for my cat! The staff at Paws & Claws are so gentle and knowledgeable.",
                created_at=datetime.now() - timedelta(days=2)
            ),
            # # Link this to the second appointment (Sparkle Paws)
            # Review(
            #     provider_id=appointments[1].provider_id,
            #     user_id=appointments[1].pet.owner_id,
            #     appointment_id=appointments[1].id,
            #     rating=4,
            #     comment="Great grooming session, Butters looks like a new dog!",
            #     created_at=datetime.now() - timedelta(days=5)
            # ),
            # # Link this to the fourth appointment (Happy Tails)
            # Review(
            #     provider_id=appointments[4].provider_id,
            #     user_id=appointments[4].pet.owner_id,
            #     appointment_id=appointments[4].id,
            #     rating=3,
            #     comment="Happy Tails is reliable, but the 30-minute walk ended up being closer to 20 minutes today.",
            #     created_at=datetime.now() - timedelta(days=1)
            # ),
        ]
        
        db.session.add_all(test_reviews)
        db.session.commit()
        print("✅ Reviews hardcoded successfully with Appointment IDs!")
    # ==========================================
    # EXTRA SEED DATA: Generic Users, Pets, Appointments & Reviews
    # ==========================================
    
    # 1. Create Generic Users
    gen_user1 = User(first_name="Mc", last_name="Lovin", email="mc.lovin@test.com", phone_number="+61400000011", role="user")
    gen_user1.set_password("password123")
    
    gen_user2 = User(first_name="Mya", last_name="Banks", email="mya.banks@test.com", phone_number="+61400000012", role="user")
    gen_user2.set_password("password123")
    
    gen_user3 = User(first_name="John", last_name="Pork", email="john.pork@test.com", phone_number="+61400000013", role="user")
    gen_user3.set_password("password123")
    
    db.session.add_all([gen_user1, gen_user2, gen_user3])
    db.session.commit()

    # 2. Create Pets for the Generic Users
    gen_pet1 = Pet(owner_id=gen_user1.id, name="Buddy", species=SpeciesEnum.dog, breed="Poodle", gender=GenderEnum.female, desexed=True, date_of_birth=date(2022, 5, 12), weight=12.0)
    gen_pet2 = Pet(owner_id=gen_user2.id, name="Bagel", species=SpeciesEnum.dog, breed="Labrador", gender=GenderEnum.male, desexed=True, date_of_birth=date(2021, 8, 20), weight=30.0)
    gen_pet3 = Pet(owner_id=gen_user3.id, name="Darcy", species=SpeciesEnum.dog, breed="Husky", gender=GenderEnum.female, desexed=False, date_of_birth=date(2023, 2, 10), weight=22.0)
    
    db.session.add_all([gen_pet1, gen_pet2, gen_pet3])
    db.session.commit()

    # 3. Create COMPLETED Appointments (Required for reviews)
    gen_appts = [
        # Good Boy Puppy School (providers[3])
        Appointment(pet_id=gen_pet1.id, provider_id=providers[3].id, date_time=datetime.now(timezone.utc) - timedelta(days=10), service_type=ServiceType.PUPPY_TRAINING, status=AppointmentStatus.COMPLETED, notes="Graduated puppy school"),
        # Safe Hands Desexing Clinic (providers[4])
        Appointment(pet_id=gen_pet2.id, provider_id=providers[4].id, date_time=datetime.now(timezone.utc) - timedelta(days=14), service_type=ServiceType.DESEXING, status=AppointmentStatus.COMPLETED, notes="Routine desexing"),
        # Canine Smiles Dental (providers[5])
        Appointment(pet_id=gen_pet3.id, provider_id=providers[5].id, date_time=datetime.now(timezone.utc) - timedelta(days=5), service_type=ServiceType.DENTAL, status=AppointmentStatus.COMPLETED, notes="Teeth scaling")
    ]
    
    db.session.add_all(gen_appts)
    db.session.commit()

    # 4. Create the Reviews for those specific clinics
    gen_reviews = [
        Review(provider_id=providers[3].id, user_id=gen_user1.id, appointment_id=gen_appts[0].id, rating=5, comment="Fantastic puppy school! Buddy learned so much and the trainers were incredibly patient.", created_at=datetime.now() - timedelta(days=9)),
        
        Review(provider_id=providers[4].id, user_id=gen_user2.id, appointment_id=gen_appts[1].id, rating=5, comment="Very professional and caring. Bagel recovered beautifully from his procedure at Safe Hands.", created_at=datetime.now() - timedelta(days=12)),
        
        Review(provider_id=providers[5].id, user_id=gen_user3.id, appointment_id=gen_appts[2].id, rating=4, comment="Great dental service. Darcy's teeth have never looked better, though the wait time was a bit long.", created_at=datetime.now() - timedelta(days=4))
    ]
    
    db.session.add_all(gen_reviews)
    db.session.commit()
    print("✅ Generic users and reviews seeded successfully!")
