import { Link } from "react-router-dom";


function GuestHeader() {
  return (
    <>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/services">Services</Link></li>
      </ul>

      <div className="access-btn">
        <Link to='/login'>
          <button className="login">Login</button>
        </Link>
        <Link to='/register'>
          <button className="signup">Sign Up</button>
        </Link>
      </div>
    </>
  );
}


export default GuestHeader;
