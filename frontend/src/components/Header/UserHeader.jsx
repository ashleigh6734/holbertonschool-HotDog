import { Link } from "react-router-dom";
import Avatar from "../avatar/Avatar.jsx";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function UserHeader() {
  const { user } = useContext(AuthContext);
  return (
    <ul className="nav-links">
      <li>
        <Link to="/dashboard">Dashboard</Link>
      </li>
      <li>
        <Link to="/services">Services</Link>
      </li>
      {/* <li><Link to="/pets">My Pets</Link></li> */}
      <li>
        <Link to="/appointments">Appointments</Link>
      </li>
      <Avatar user={user} />
    </ul>
  );
}

export default UserHeader;
