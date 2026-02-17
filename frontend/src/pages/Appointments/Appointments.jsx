import { useState } from "react";
import "./Appointments.css";
import "./DateStep.jsx";

export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="appointment-page">
      <div className="appointment-container">
        <div className="provider-content">
          <h1>All Things Pets Clinic</h1>
          <div className="provider-img-container">
            <img
              src="src/assets/images/vet-clinic-1.jpg"
              alt="provider-image"
            />
          </div>

          <div className="provider-info">
            <div className="provider-address flex-gap">
              <img src="src/assets/icons/geo-alt.svg" alt="Bootstrap" />
              <span>12 South Street, Melbourne 3000</span>
            </div>
            <div className="provider-email flex-gap">
              <img src="src/assets/icons/email.svg" alt="Bootstrap" />
              <span> allthingspetsclinic@businessemail.com</span>
            </div>
            <div className="provider-number flex-gap">
              <img src="src/assets/icons/phone.svg" alt="Bootstrap" />
              <span>0427 272 783</span>
            </div>
          </div>
          <div className="provider-details">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
            volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
            ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo
            consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate
            velit esse
          </div>
        </div>
        <div className="bookings">
          <div className="bookings-banner">Make a booking</div>
          <div className="booking-container">
            <DateStep value={selectedDate} onChange={setSelectedDate} />
          </div>
        </div>
        /* PLACEHOLDER FOR REVIEWS */
      </div>
    </div>
  );
}
