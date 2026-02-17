import { Link } from "react-router-dom";
import GuestHeader from "./GuestHeader";
import UserHeader from "./UserHeader";
import "./Header.css";

function Header({ isLoggedIn }) {
  return (
    <header> 
      {/* Logo */}
      <img 
        src="../../assets/logo/hotdog_logo_yellow_background.svg" alt="HotDog Logo" 
        className="hotdog-logo"
      />
      
      {/* Navigation */}
      <nav>
        {isLoggedIn ? <UserHeader /> : <GuestHeader />}
      </nav>

      {/* EMILY, I'M HERE*/}
      {/* profile icon */}
      {isLoggedIn ? (
        <img
          src="../../assets/icons/account-profile.png"
          alt="Profile"
          className="profile-icon"
        />
      ) : (
        <div className="access-btn">
          <button className="login">Login</button>
          <button className="signup">Sign Up</button>
        </div>
      )}

    </header>
  );
}

export default Header;
