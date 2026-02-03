import { useState } from "react";
import { Link } from "react-router-dom";
import avatarIcon from "../../assets/icons/user-avatar.png";
import "./Avatar.css";

export default function Avatar({ user }) {
  const [open, setOpen] = useState(false);

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
          <button className="logout">Logout</button>
        </div>
      )}
    </div>
  );
}
