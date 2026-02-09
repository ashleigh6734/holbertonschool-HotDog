def test_create_user_route(client):
    response = client.post("/api/users/", json={
        "first_name": "Jane",
        "last_name": "Doe",
        "email": "jane@example.com",
        "password": "password123"
    })

    assert response.status_code == 201
    assert response.json["email"] == "jane@example.com"

def test_create_user_missing_fields(client):
    response = client.post("/api/users/", json={
        "email": "jane@example.com"
    })

    assert response.status_code == 400