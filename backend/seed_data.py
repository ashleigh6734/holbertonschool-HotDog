from app import create_app
from app.extensions import db
from app.models.user import User

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    user1 = User(
        first_name="John",
        last_name="Doe",
        email="john@test.com",
    )
    user1.set_password("password123")

    db.session.add(user1)
    db.session.commit()

    print("User seeded successfully")