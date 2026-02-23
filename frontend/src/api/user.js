export async function deleteUser(user, token) {
  const API_DELETE_URL = `http://localhost:5000/api/users/${user.id}`;

  const response = await fetch(`${API_DELETE_URL}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    if (data.error === "User not found") {
      return { status: "not-found", message: "No User Found" };
    }
    return { status: "failed", message: data.error || "Delete failed" };
  }

  if (data.message === "User successfully deleted") {
    return { status: "success", message: "User deleted successfully" };
  }
  return { status: "unknown", message: "Unknown response" };
}
