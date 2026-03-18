import React, { useState, useEffect } from "react";
import "./addpetform.css";
import { createPet } from "../../api/pet";

function FormAddPet({ closePopup, onPetAdded }) {
  const [values, setValues] = useState({
    name: "",
    species: "",
    breed: "",
    gender: "",
    desexed: "",
    date_of_birth: "",
    weight: "",
    notes: "",
    age: "",
  });

  const [options, setOptions] = useState({
    species: [],
    dogBreeds: [],
    catBreeds: [],
    genders: [],
  });

  // Fetch pet options from backend
  useEffect(() => {
    const fetchOptions = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_URL}/api/pets/options`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error(`Failed to load pet options: ${res.status}`);
        }
        const data = await res.json();
        setOptions(data);
      } catch (err) {
        console.error("Failed to fetch pet options", err);
      }
    };
    fetchOptions();
  }, []);

  // Calculate age
  const calculateAge = (dobString) => {
    if (!dobString) return "";
    const [day, month, year] = dobString.split("/");
    if (!day || !month || !year) return "";

    const dob = new Date(year, month - 1, day);
    const today = new Date();

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();

    if (today.getDate() < dob.getDate()) months -= 1;
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    if (years && months) return `${years} year${years > 1 ? "s" : ""} ${months} month${months > 1 ? "s" : ""}`;
    if (years) return `${years} year${years > 1 ? "s" : ""}`;
    if (months) return `${months} month${months > 1 ? "s" : ""}`;
    return "0 months";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => {
      const newValues = { ...prev, [name]: value };

      // Recalculate age if DOB changes
      if (name === "date_of_birth") {
        newValues.age = calculateAge(value);
      }

      // Reset breed when species changes
      if (name === "species") {
        newValues.breed = "";
      }

      return newValues;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    try {
      // Convert DD/MM/YYYY -> YYYY-MM-DD for backend
      let dobFormatted = null;
      if (values.date_of_birth) {
        const [day, month, year] = values.date_of_birth.split("/");
        if (day && month && year) {
          dobFormatted = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        } else {
          alert("Date of birth must be in DD/MM/YYYY format");
          return;
        }
      }

      const payload = {
        name: values.name,
        species: values.species.toLowerCase(),
        breed: values.breed,
        gender: values.gender.toLowerCase(),
        desexed: values.desexed === "Yes",
        date_of_birth: dobFormatted,
        weight: values.weight ? parseFloat(values.weight) : null,
        notes: values.notes,
      };

      await createPet(payload, token);
      onPetAdded();
      closePopup();
    } catch (err) {
      console.error("Error creating pet:", err);
      alert("Failed to add pet: " + (err.message || "Unknown error"));
    }
  };

  const breedOptions =
    values.species.toLowerCase() === "dog"
      ? options.dogBreeds
      : values.species.toLowerCase() === "cat"
      ? options.catBreeds
      : [];

  return (
    <div className="pet-form-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Pet Name*</label>
        <input type="text" name="name" placeholder="Enter Pet Name" value={values.name} onChange={handleChange} required />

        <label htmlFor="species">Species*</label>
        <select name="species" value={values.species} onChange={handleChange} required>
          <option value="" disabled>Select a species</option>
          {options.species.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>

        <label htmlFor="breed">Breed*</label>
        <select name="breed" value={values.breed} onChange={handleChange} required>
          <option value="" disabled>Select a breed</option>
          {breedOptions.map((b) => (
            <option key={b} value={b}>{b.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}</option>
          ))}
        </select>

        <label htmlFor="gender">Gender*</label>
        <div className="gender-radiobutton">
          {options.genders.map((g) => (
            <label key={g}>
              <input type="radio" name="gender" value={g} checked={values.gender === g} onChange={handleChange} required />
              <span>{g.charAt(0).toUpperCase() + g.slice(1)}</span>
            </label>
          ))}
        </div>

        <label htmlFor="desexed">Desexed (if known)</label>
        <div className="desexed-radiobutton">
          <label>
            <input type="radio" name="desexed" value="Yes" checked={values.desexed === "Yes"} onChange={handleChange} />
            <span>Yes</span>
          </label>
          <label>
            <input type="radio" name="desexed" value="No" checked={values.desexed === "No"} onChange={handleChange} />
            <span>No</span>
          </label>
        </div>

        <label htmlFor="date_of_birth">Date of Birth*</label>
        <input
          type="text"
          name="date_of_birth"
          value={values.date_of_birth}
          onChange={handleChange}
          placeholder="DD/MM/YYYY"
          required
        />

        <label htmlFor="age">Age</label>
        <input 
          type="text" 
          name="age" 
          value={values.age} 
          readOnly placeholder="Age will be calculated automatically" 
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
          rows="5" 
          value={values.notes} 
          onChange={handleChange} 
          placeholder="Important notes about your pet." 
        />

        <div className="button-group">
          <button type="button" onClick={closePopup} className="cancelbutton">Cancel</button>
          <button type="submit" className="submitbutton">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default FormAddPet;
