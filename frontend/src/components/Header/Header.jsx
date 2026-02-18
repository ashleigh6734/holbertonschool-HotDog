import { Link } from "react-router-dom";
import GuestHeader from "./GuestHeader";
import UserHeader from "./UserHeader";
import "./Header.css";

//images
import logoHeader from "../../assets/logo/hotdog_logo_yellow background.svg";
import profileIcon from "../../assets/icons/account-profile.png";

function Header({ isLoggedIn }) {
  return (
    <header> 
      {/* Logo */}
      <img 
        src={logoHeader}
        alt="HotDog Logo" 
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
          src={profileIcon}
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
