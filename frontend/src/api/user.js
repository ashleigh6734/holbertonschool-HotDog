// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

export async function deleteUser(user, token) {
  const API_LOGIN_URL = `http://localhost:5000/api/users/${user.id}`;
  console.log(user.id, "user_id");
  const response = await fetch(`${API_LOGIN_URL}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to delete user");
  }

  return data;
}
