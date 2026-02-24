import React, { useState, useEffect } from "react";
import "./addpetform.css";

function FormAddPet() {

  // const [value, setValue] = useState(0)

  // useEffect(() => {
  //   const fetchGet
  // })
  // const [values, setValues] = useState({
  //   name: "",
  //   species: "",
  //   breed: "",
  //   gender: "",
  //   desexed: "",
  //   date_of_birth: "",
  //   weight: "",
  //   notes: "",
  //   age: "",
  // })

  const handelChange = (e) => {
    setValues({...values, [e.target.name]:[e.taRget.value]})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(values)
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <lable htmlFor="name">Pet Name*</lable>
        <input type="text" placeholder="Enter Pet Name" name="name" value={values.name} onChange={(e) => handelChange(e)} required/>

        <lable htmlFor="weight">Weight</lable>
        <input type="text" placeholder="Enter Pet's Weight'" name="weight" onChange={(e) => handelChange(e)}/>

        <lable htmlFor="breed">Breed</lable>
        <select name="breed" id="breed" value={values.weight} value={values.breed} onChange={(e) => handelChange(e)} required>
          <option value="breed">Breed1</option>
          <option value="breed">Breed2</option>
          <option value="breed">Breed3</option>
          <option value="breed">Breed4</option>
        </select>
        
        {/* dropdown list */}
        <lable htmlFor="species">Species</lable>
        <select name="species" id="species" value={values.species} onChange={(e) => handelChange(e)} required>
          <option value="species">Species1</option>
          <option value="species">Species2</option>
          <option value="species">Species3</option>
          <option value="species">Species4</option>
        </select>

        <lable htmlFor="gender">Gender</lable>
        <input type="radio" name="gender" value="Female" checked={values.gender === "Female"} onChange={(e) => handelChange(e)} required/> Female
        <input type="radio" name="gender" checked={values.gender === "Male"} onChange={handleChange} onChange={(e) => handelChange(e)} required/> Male

        <lable htmlFor="desexed">Desexed</lable>
        <input type="radio" name="desexed" value="Yes" checked={values.desexed === "Yes"} onChange={(e) => handelChange(e)}/> Yes
        <input type="radio" name="desexed" value="No" checked={values.desexed === "No"} onChange={(e) => handelChange(e)}/> No

        <lable htmlFor="date_of_birth">Date of Birth</lable>
        <input type="text" placeholder="Enter Date of Birth" name="date_of_birth" value={values.date_of_birth} onChange={(e) => handelChange(e)} required/>

        {/* auto populate of age */}

        <lable htmlFor="notes">Notes</lable>
        <textarea name="notes" id="notes" cols="30" rows="10" value={values.notes} onChange={(e) => handelChange(e)} placeholder="Please provide any important notes about your pet. Providers will have access to this information."></textarea>

        <button type="button">Cancel</button> <button type="submit">Submit</button>


      </form>
    </div>
  );
}


export default FormAddPet;