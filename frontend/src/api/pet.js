export const getMyPets = async (token) => {
  const response = await fetch("/api/pets/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch pets");
  }

  return response.json();
};
