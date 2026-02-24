import "./ProviderBookings.css";
import UpcomingEvents from "../../../components/ProviderSideAppointments/UpcomingEvents";
import { UPCOMING_APPOINTMENTS } from "./ProviderBookingsData";
import { useNavigate } from "react-router-dom";

export default function ProviderBookings() {
  const navigate = useNavigate();
  return (
    <div className="wrapper-container">
      <div className="bookings-header-bar">
        <h1 className="my-auto">Bookings</h1>
        <button
          className="manage-bookings-btn"
          onClick={() => navigate("/manage-appointments")}
        >
          Manage Bookings
        </button>
      </div>
      <div className="upcoming-appointments-container">
        {" "}
        <p>View and manage all your upcoming appointments in one place:</p>
        <div className="upcoming-appointments-table">
          <UpcomingEvents upcomingEvents={UPCOMING_APPOINTMENTS} />
        </div>
      </div>
      <div className="provider-bookings-container">
        PLACEHOLDER FOR BOOKING SLOTS
      </div>
    </div>
  );
}
