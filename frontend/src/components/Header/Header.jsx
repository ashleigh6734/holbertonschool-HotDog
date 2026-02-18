import { Link } from "react-router-dom";
import GuestHeader from "./GuestHeader";
import UserHeader from "./UserHeader";
import Avatar from "../avatar/Avatar.jsx";
import "./Header.css";
import logoHeader from "../../assets/logo/hotdog_logo_blue_background.svg";

//images
import logoHeader from "../../assets/logo/hotdog_logo_yellow background.svg";
import profileIcon from "../../assets/icons/account-profile.png";

function Header({ isLoggedIn }) {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
<<<<<<< HEAD
    <header> 
      {/* Logo */}
      <img 
        src={logoHeader}
        alt="HotDog Logo" 
        className="hotdog-logo"
      />
      
=======
    <header>
      <img src={logoHeader} alt="HotDog Logo" className="hotdog-logo" />

>>>>>>> origin/main
      {/* Navigation */}
      <nav>{isLoggedIn ? <UserHeader /> : <GuestHeader />}</nav>

      {/* EMILY, I'M HERE*/}

      {isLoggedIn ? (
<<<<<<< HEAD
        <img
          src={profileIcon}
          alt="Profile"
          className="profile-icon"
        />
=======
        <Avatar />
>>>>>>> origin/main
      ) : (
        <div className="access-btn">
          <button className="login">Login</button>
          <button className="signup">Sign Up</button>
          {/* <Avatar /> */}
        </div>
      )}
    </header>
  );
}

export default Header;
