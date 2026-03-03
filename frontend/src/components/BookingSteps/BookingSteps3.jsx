import React from "react";
import "./bookingsteps.css";
import confirmationIcon from "../../assets/icons/confirmation-icon.png";

function BookingSteps3({ closePopup, bookingData, selectedDate, selectedTime, address }) { 
  if (!bookingData) return <div>Loading...</div>;

  return (
    <div className="bookingsequence-container">
      <img src={confirmationIcon} alt="Confirmation" className="confirmation-icon"/>
      <h2 className="bookingsequence-h2">Appointment Confirmed!</h2>
      <div className="bookingsequence3">
        <div className="apptdetail-titles-container">
          <p>Pet:</p> 
          <p>Booking Type:</p>
          <p>Date:</p>
          <p>Time:</p> 
          <p>Location:</p> 
        </div>
        
        <div className="apptdetail-container">
          <p>{bookingData.name}</p>
          <p>{bookingData.booking_type}</p>
          <p>{selectedDate.format("DD/MM/YYYY")}</p>
          <p>{selectedTime}</p>
          <p>{address}</p>
        </div>
      </div>

      <hr />

      <p className="bold-word-accent">Thank you for making your appointment online.</p>
      <p>Appointments can be managed online. We kindly ask that cancellations be made at least 24 hours prior to the scheduled appointment.</p>
      <p className="bold-word-accent">We look forward to taking care of your health needs.</p>

      <button type="button" className="bookingsequence-closebutton" onClick={closePopup}>Close</button>
    </div>
  );
}

export default BookingSteps3;