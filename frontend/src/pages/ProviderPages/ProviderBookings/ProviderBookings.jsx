import "./ProviderBookings.css";
import UpcomingEvents from "../../../components/ProviderSideAppointments/UpcomingEvents";
import { UPCOMING_APPOINTMENTS } from "./ProviderBookingsData";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import dayjs from "dayjs";
import DateStep from "../../Appointments/DateStep";
import TimeStep from "../../Appointments/TimeStep";

export default function ProviderBookings() {
  const navigate = useNavigate();
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(today); // store selected date
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  return (
    <div className="wrapper-container">
      <div className="bookings-header-bar">
        <h1 className="my-auto">Appointments</h1>
        <button
          className="manage-bookings-btn"
          onClick={() => navigate("/manage-appointments")}
        >
          Manage Appointments
        </button>
      </div>
      <div className="upcoming-appointments-container">
        {" "}
        <p>View and manage all your upcoming appointments in one place:</p>
        <div className="upcoming-appointments-table">
          <UpcomingEvents upcomingEvents={UPCOMING_APPOINTMENTS} />
        </div>
      </div>
      <div className="new-appointment-container">
        <div className="book-appointment-banner">
          <p>Book a new appointment</p>
        </div>
        <div className="provider-bookings-container">
          <div className="date-container">
            <DateStep
              value={selectedDate}
              onChange={setSelectedDate}
              sx={{
                margin: 0,
                padding: 0,
                transform: "scale(1.2)",
                alignSelf: "flex-start",
              }}
            />
          </div>
          <div className="time-container">
            <TimeStep
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              times={availableTimes}
            />
          </div>
        </div>

        {selectedTime != "" && (
          <div className="action-btn-container">
            <button
              className="action-btn-format grey-btn"
              onClick={() => {
                setSelectedTime("");
              }}
            >
              Cancel
            </button>
            <button className="action-btn-format navy-btn">Book</button>
          </div>
        )}
      </div>
    </div>
  );
}
