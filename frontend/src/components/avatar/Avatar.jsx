import { useState } from "react";
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
          <button>Manage Appointments</button>
          <button>Pet Medical History</button>
          <button>Profile</button>
          <button>Account</button>
          <button className="logout">Logout</button>
        </div>
      )}
    </div>
  );
}
