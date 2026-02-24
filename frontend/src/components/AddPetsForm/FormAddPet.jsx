import React, { useState } from "react";
import "./addpetform.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

function FormAddPet({ closePopup }) {

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
    setValues({
      ...values, 
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(values);
    closePopup();
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

        <label htmlFor="weight">Weight<span style={{ fontWeight: "normal" }}> (if known)</span></label>
        <input 
          type="text" 
          placeholder="Enter Pet's Weight" 
          name="weight" 
          value={values.weight}
          onChange={handleChange}
        />

        <label htmlFor="breed">Breed</label>
        <select 
          name="breed" 
          id="breed" 
          value={values.breed}
          onChange={handleChange} 
          required
        >
          <option value="" disabled> 
            Select a breed
          </option>
          <option value="breed">Breed1</option>
          <option value="breed">Breed2</option>
          <option value="breed">Breed3</option>
          <option value="breed">Breed4</option>
        </select>
        
        {/* dropdown list */}
        <label htmlFor="species">Species</label>
          <select 
            name="species" 
            id="species" 
            value={values.species}
            onChange={handleChange} 
            required
          >
            <option value="" disabled> 
              Select a species
            </option>
            <option value="species">Species1</option>
            <option value="species">Species2</option>
            <option value="species">Species3</option>
            <option value="species">Species4</option>
          </select>
        
        
        <label htmlFor="gender">Gender</label>
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
  

        <label htmlFor="desexed">Desexed<span style={{ fontWeight: "normal" }}> (if known)</span></label>
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

        <label htmlFor="date_of_birth">Date of Birth</label>
        <input 
          type="date" name="date_of_birth" 
          value={values.date_of_birth}
          onChange={handleChange} 
          required
        />
        

        {/* auto populate of age */}

        <label htmlFor="note">Notes</label>
        <textarea 
          name="notes" 
          id="notes" 
          cols="30" 
          rows="10" 
          value={values.notes}
          onChange={handleChange} placeholder="Please provide any important notes about your pet. Providers will have access to this information."
        />
        {/* </textarea> */}

        <button type="button" onClick={closePopup} className="cancelbutton">Cancel</button> <button type="submit" className="submitbutton">Submit</button>


      </form>
    </div>
  );
}


export default FormAddPet;