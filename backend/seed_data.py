from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.pet import Pet
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
    )
    user1.set_password("password123")

    db.session.add(user1)
    db.session.commit() # commit first so user 1 gets an ID


    # =====================
    # Seed pets
    # =====================
    pet1 = Pet(
        owner_id=user1.id,
        name="Butters",
        species="Dog",
        breed="Toller Retriever",
        date_of_birth=date(2024, 1, 17),
        weight=28.5,
        medical_notes="Up to date on vaccinations"
    )

    pet2 = Pet(
        owner_id=user1.id,
        name="Snom",
        species="Cat",
        breed="Ragdoll",
        date_of_birth=date(2023, 1, 10),
        weight=4.2,
        medical_notes="Indoor cat"
    )

    db.session.add_all([pet1, pet2])
    db.session.commit()

    print("User and pets seeded successfully")