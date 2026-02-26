import React, { useState } from "react";
import "./addpetform.css";
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
        <label htmlFor="name">Pet Name*</label>
        <input
          type="text"
          placeholder="Enter Pet Name"
          name="name"
          value={values.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="species">Species*</label>
        <select
          name="species"
          id="species"
          value={values.species}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select a species</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
        </select>

        <label htmlFor="breed">Breed*</label>
        <select
          name="breed"
          id="breed"
          value={values.breed}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select a breed</option>
          <option value="labrador">Labrador</option>
          <option value="golden_retriever">Golden Retriever</option>
          <option value="german_shepherd">German Shepherd</option>
          <option value="bulldog">Bulldog</option>
          <option value="mixed">Mixed</option>
        </select>

        <label htmlFor="gender">Gender*</label>
        <div className="gender-radiobutton">
          <label>
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={values.gender === "Female"}
              onChange={handleChange}
              required
            />
            <span>Female</span>
          </label>

          <label>
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={values.gender === "Male"}
              onChange={handleChange}
              required
            />
            <span>Male</span>
          </label>
        </div>

        <label htmlFor="desexed">Desexed (if known)</label>
        <div className="desexed-radiobutton">
          <label>
            <input
              type="radio"
              name="desexed"
              value="Yes"
              checked={values.desexed === "Yes"}
              onChange={handleChange}
            />
            <span>Yes</span>
          </label>

          <label>
            <input
              type="radio"
              name="desexed"
              value="No"
              checked={values.desexed === "No"}
              onChange={handleChange}
            />
            <span>No</span>
          </label>
        </div>

        <label htmlFor="date_of_birth">Date of Birth*</label>
        <input
          type="date"
          name="date_of_birth"
          value={values.date_of_birth}
          onChange={handleChange}
          required
        />

        <label htmlFor="weight">Weight (kg)</label>
        <input
          type="text"
          name="weight"
          placeholder="Enter Pet's Weight"
          value={values.weight}
          onChange={handleChange}
        />

        <label htmlFor="notes">Notes</label>
        <textarea
          name="notes"
          id="notes"
          cols="30"
          rows="10"
          value={values.notes}
          onChange={handleChange}
          placeholder="Please provide any important notes about your pet. Providers will have access to this information."
        />

        <button type="button" onClick={closePopup} className="cancelbutton">
          Cancel
        </button>
        <button type="submit" className="submitbutton">
          Submit
        </button>
      </form>
    </div>
  );
}

export default FormAddPet;