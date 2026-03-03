import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Avatar from "../avatar/Avatar.jsx";
import DashboardHero from "../../components/Dashboard/DashboardHero.jsx";

function UserHeader() {
  const { user } = useContext(AuthContext);

  return (
    <div className="header-grid">
      {/* Navigation */}
      <ul className="nav-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/appointments/:id">Appointments</Link></li>
      </ul>
      
      {/* User Area */}
      <div className="user-area">
        <DashboardHero
          name={user?.first_name}
          displayGreeting={true}
        />
        <Avatar user={user} />
      </div>
    </div>
  );
}

export default UserHeader;