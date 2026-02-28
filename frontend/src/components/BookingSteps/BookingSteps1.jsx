import React, { useState } from "react";
import "./bookingsteps.css";
import { createPet } from "../../api/pet";

function BookingSteps1({ closePopup, onPetAdded }) { // fixed prop name
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

        <div className="selectpet-container">
          <label htmlFor="desexed">Have you been to All Things Pets Clinic with any pet before?</label>
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


          <label htmlFor="species">Which pet is appointment for?*</label>
          <select
            name="species"
            id="species"
            value={values.species}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select pet</option>
            <option value="vet-consultations">Vet Consultations</option>
            <option value="vaccinations">Vaccinations</option>
            <option value="desexing">Desexing</option>
          </select>

          <button type="submit" className="submitbutton1">
            Submit
          </button>
        </div>


        {/* BOOKING TYPES */}
        <label htmlFor="breed">Booking Type*</label>
        <select
          name="breed"
          id="breed"
          value={values.breed}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select a breed</option>
          <option value="vet-consultations">Vet Consultations</option>
          <option value="vaccinations">Vaccinations</option>
          <option value="desexing">Desexing</option>
          <option value="dental">Dental</option>
          <option value="nail-trimming">Nail Trimming</option>
          <option value="haircuts-coat">Haircuts Coat</option>
          <option value="dog-walking">Dog Walking</option>
          <option value="puppy-training">Puppy Training</option>
        </select>

        

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

export default BookingSteps1;