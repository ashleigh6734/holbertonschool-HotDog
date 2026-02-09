from app.models.user import User
import pytest

def test_password_hashing():
    user = User(
        first_name="Jane",
        last_name="Doe",
        email="jane@example.com"
    )

    user.set_password("password123")

    assert user.password_hash is not None
    assert user.check_password("password123") is True
    assert user.check_password("wrongpassword") is False

def test_email_is_lowercased():
    user = User(
        first_name="Jane",
        last_name="Doe",
        email="TEST@EMAIL.COM"
    )

    assert user.email == "test@email.com"

def test_invalid_email_raises_error():
    with pytest.raises(ValueError):
        User(
            first_name="Jane",
            last_name="Doe",
            email="not-an-email"
        )

def test_name_too_long_raises_error():
    with pytest.raises(ValueError):
        User(
            first_name="J" * 51,
            last_name="Doe",
            email="jane@example.com"
        )

def test_invalid_role_raises_error():
    with pytest.raises(ValueError):
        User(
            first_name="Jane",
            last_name="Doe",
            email="jane@example.com",
            role="admin"
        )

def test_invalid_phone_number_raises_error():
    with pytest.raises(ValueError):
        User(
            first_name="Jane",
            last_name="Doe",
            email="jane@example.com",
            phone_number="123abc"
        )
