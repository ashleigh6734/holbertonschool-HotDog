import React, { useState } from "react";
import "./addpetform.css";
import "./";

function FormAddPet() {
  // THESE ARE MOCKS -- NEED T MAKE SURE THEY ALIGN WITH BACKEND API ENDPOINT
  const [values, setValues] = useState({
    status: "",
    bookingtype: "",
    pet: "",
  })

  const handelChange = (e) => {
    setValues({...values, [e.target.name]:[e.taRget.value]})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(values)
  }

  //CALLING API
  

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>

        <lable htmlFor="status">Have you been to (COMPANY NAME) with any pet before?</lable>
        <input type="radio" name="status" value="Yes" checked={values.status === "Yes"} onChange={(e) => handelChange(e)}/> Yes
        <input type="radio" name="status" value="No" checked={values.status === "No"} onChange={(e) => handelChange(e)}/> No

        {/* FOR PROVIDER - NEEDS TO BE ABLE TO OWNER NAME OR TEXTBOX TO FILL IN OWNERS DETAILS */}

        {/* dropdown list */}
        <lable htmlFor="pet">Which pet is the appointment for?</lable>
        <select name="pet" id="pet" value={values.pet} onChange={(e) => handelChange(e)} required>
          <option value="pet">pet 1</option>
          <option value="pet">pet 2</option>
          <option value="pet">pet 3</option>
          <option value="pet">pet 4</option>
        </select>

        <button type="submit">Submit</button>
        
        {/* dropdown list */}
        <lable htmlFor="bookingtype">Booking Type</lable>
        <select name="bookingtype" id="bookingtype" value={values.bookingtype} onChange={(e) => handelChange(e)} required>
          <option value="bookingtype">Booking Type</option>
          <option value="bookingtype">Booking Type</option>
          <option value="bookingtype">Booking Type</option>
          <option value="bookingtype">Booking Type</option>
        </select>
        

        <button type="button">Cancel</button> <button type="submit">Continue</button>


      </form>
    </div>
  );
}


export default FormAddPet;