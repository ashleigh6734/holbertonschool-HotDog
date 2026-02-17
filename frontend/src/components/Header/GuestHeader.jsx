import { Link } from "react-router-dom";


function GuestHeader() {
  return (
    <ul className="nav-links">
      <li><Link to="/">Home</Link></li>
      <li><Link to="/about">About Us</Link></li>
      <li><Link to="/services">Services</Link></li>
    </ul>
  );
}


export default GuestHeader;
