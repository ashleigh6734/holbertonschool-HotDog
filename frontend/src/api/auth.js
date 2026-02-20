const API_URL = "http://127.0.0.1:5000/api/users/";

export async function registerUser(userData) {
    const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Registration failed");
    }

    return data;
}

const API_LOGIN_URL = "http://127.0.0.1:5000/api/auth/login"

export async function loginUser(credentials) {
    const response = await fetch(`${API_LOGIN_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Invalid email or password");
    }

    return data;
}