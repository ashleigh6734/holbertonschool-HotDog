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
        <h4>Please note that this appointment type is not suitable for any
        procedures.
        </h4>
        <p>If you require a procedure we ask that you please call our reception instead to ensure that the appropriate resources, time and facilities are allocated to you. Thank you</p>

        <hr />
        
        <p>PLEASE READ BELOW BEFORE ANSWERING YES OR NO</p>
        <p>We take pet insurance</p>
        
        <p> All other patients will be privately billed at all times. A detailed fee schedule is available at medicfirst.com.au/fees/ Do you understand and agree to the fee schedule? 24 hourse cancellatiion
        </p>
        
        <button type="button" onClick={closePopup} className="cancelbutton">
          Yes
        </button>
        <button type="submit" className="submitbutton">
          No
        </button>

    </div>
  );
}

export default FormAddPet;