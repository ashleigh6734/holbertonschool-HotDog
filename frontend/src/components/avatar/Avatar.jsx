import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import avatarIcon from "../../assets/icons/user-avatar.png";
import "./Avatar.css";
import { AuthContext } from "../../context/AuthContext";

export default function Avatar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="avatar-container">
      <button className="avatar-btn" onClick={() => setOpen(!open)}>
         <img
          src={user?.avatarUrl || avatarIcon}
          alt="user avatar"
          className="avatar-img"
        />
      </button>

      {open && (
        <div className="avatar-menu">
          <Link to="/appointments">Manage Appointments</Link>
          <Link to="/medical-history">Pet Medical History</Link>
          <Link to="/pet-profile">Profile</Link>
          <Link to="/account">Account</Link>
          <button 
          className="logout"
          onClick={() => {
            logout(); // call context for logout function
            setOpen(false); // close menu after logout
          }}
          >
            Logout</button>
        </div> 
      )}
    </div>
  );
}
