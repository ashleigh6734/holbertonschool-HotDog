from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.pet import Pet, SpeciesEnum, GenderEnum
from datetime import date

app = create_app()

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
        medical_notes="Up to date on vaccinations"
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
        medical_notes="Indoor cat"
    )

    db.session.add_all([pet1, pet2])
    db.session.commit()

    print("User and pets seeded successfully")