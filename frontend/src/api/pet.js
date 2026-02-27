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

export const getPetById = async (petId, token) => {
  const response = await fetch(`/api/pets/${petId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch pet");
  }

  return response.json();
};

// created api function for posting a pet
export const createPet = async (petData, token) => {
  const response = await fetch("/api/pets/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(petData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to create pet");
  }

  return data;
};