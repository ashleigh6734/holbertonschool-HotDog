import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./providernavStyles.css";
import yellowLogo from "../../assets/logo/hotdog_logo_yellow_background.svg";

function ProviderNav() {
  const { user, logout } = useContext(AuthContext);

  return (
      <ul className="provider-links">
        <img src={yellowLogo} alt="HotDog Logo" className="bluehotdog-logo" />
        <li><Link to="/ProviderDashboard">Dashboard</Link></li>
        <li><Link to="/provider/appointments">Appointments</Link></li>
        <li><Link to="/PatientList">Patient List</Link></li>
        <li><Link to="/Reminders">Reminders</Link></li>
        <li><Link to="/Account">Account</Link></li>
          <button 
            className="provider-logout"
            onClick={() => {
              logout(); // call context for logout function
            }}
            >
              Logout</button>
      </ul>
  );
}

export default ProviderNav;
