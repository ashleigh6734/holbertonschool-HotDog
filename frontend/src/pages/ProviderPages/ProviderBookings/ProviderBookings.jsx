import "./ProviderBookings.css";
import UpcomingEvents from "../../../components/ProviderSideAppointments/UpcomingEvents";
import { UPCOMING_APPOINTMENTS } from "./ProviderBookingsData";
import { useNavigate } from "react-router-dom";
import DateStep from "../../Appointments/DateStep";
import TimeStep from "../../Appointments/TimeStep";

export default function ProviderBookings() {
  const navigate = useNavigate();
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
      {/* <div className="bookings-container"> */}
      <div className="provider-date-container">
        <DateStep
          sx={{
            transform: "scale(1.5)",
            transformOrigin: "top left",
          }}
        />
      </div>
      <div className="time-container">{/* <TimeStep /> */}</div>
    </div>
    // </div>
  );
}
