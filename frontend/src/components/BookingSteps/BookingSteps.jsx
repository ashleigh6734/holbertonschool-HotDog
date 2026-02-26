import React, { useState } from "react";
import "./bookingsteps.css";
import { createPet } from "../../api/pet";

function FormAddPet({ closePopup, onPetAdded }) { // fixed prop name
  const [values, setValues] = useState({
    name: "",
    species: "",
    breed: "",
    gender: "",
    desexed: "",
    date_of_birth: "",
    weight: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    try {
      const payload = {
        name: values.name,
        species: values.species.toLowerCase(),
        breed: values.breed,
        gender: values.gender.toLowerCase(),
        desexed: values.desexed === "Yes",
        date_of_birth: values.date_of_birth,
        weight: values.weight ? parseFloat(values.weight) : null,
        notes: values.notes,
      };

      console.log("Payload sent to backend:", payload);

      const newPet = await createPet(payload, token);

      console.log("Created pet:", newPet);

      onPetAdded(); // refresh pet list
      closePopup(); // close popup

    } catch (err) {
      console.error("Error creating pet:", err);
      alert("Failed to add pet: " + (err.message || "Unknown error"));
    }
  };

  return (
    <div className="add-pet-form-container">
      <form onSubmit={handleSubmit}>

        <h2>Appointment Confirmed!</h2>

        <p>Name</p>
        <p>Company Name</p>
        <p>Date</p>
        <p>Location</p>

        {/* BOOKING TYPES */}
        <p>Thank you for making your appointment online</p>
        <p>Should you wish to manage your appointments you can do so online, or on your mobile by downloading the mobile app, AMS Connect, from your app store and following the prompts.</p>
        <p>We look forward to taking care of your health needs</p>
    

        <button type="button" onClick={closePopup} className="cancelbutton">
          Cancel
        </button>
      </form>
    </div>
  );
}

export default FormAddPet;