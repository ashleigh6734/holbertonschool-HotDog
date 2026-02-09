from app.services.user_service import UserService
from app.extensions import db
import pytest

def test_create_user_success(app):
    data = {
        "first_name": "Jane",
        "last_name": "Doe",
        "email": "jane@example.com",
        "password": "password123"
    }

    user = UserService.create_user(data)

    assert user.id is not None
    assert user.email == "jane@example.com"


def test_create_user_duplicate_email(app):
    data = {
        "first_name": "Jane",
        "last_name": "Doe",
        "email": "jane@example.com",
        "password": "password123"
    }

    UserService.create_user(data)

    with pytest.raises(ValueError):
        UserService.create_user(data)

def test_get_user_by_id(app):
    user = UserService.create_user({
        "first_name": "Jane",
        "last_name": "Doe",
        "email": "jane@example.com",
        "password": "password123"
    })

    found = UserService.get_user_by_id(user.id)

    assert found is not None
    assert found.email == "jane@example.com"

def test_get_user_not_found(app):
    user = UserService.get_user_by_id("non-existent-id")
    assert user is None
