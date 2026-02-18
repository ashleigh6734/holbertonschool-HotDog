import { Link } from "react-router-dom";
import GuestHeader from "./GuestHeader";
import UserHeader from "./UserHeader";
import Avatar from "../avatar/Avatar.jsx";
import "./Header.css";

import blueLogo from "../../assets/logo/hotdog_logo_blue_background.svg";

function Header({ isLoggedIn }) {
  return (
    <header>
      <img src={blueLogo} alt="HotDog Logo" className="hotdog-logo" />

      <nav>{isLoggedIn ? <UserHeader /> : <GuestHeader />}</nav>

      {/* FOR EMILY */}
      {isLoggedIn ? (
        <Avatar />
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
