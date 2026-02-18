import { Link } from "react-router-dom";
import GuestHeader from "./GuestHeader";
import UserHeader from "./UserHeader";
import Avatar from "../avatar/Avatar.jsx";
import "./Header.css";
import logoHeader from "../../assets/logo/hotdog_logo_blue_background.svg";

function Header({ isLoggedIn }) {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <header>
      <img src={logoHeader} alt="HotDog Logo" className="hotdog-logo" />

      {/* Navigation */}
      <nav>{isLoggedIn ? <UserHeader /> : <GuestHeader />}</nav>

      {/* EMILY, I'M HERE*/}

      {isLoggedIn ? (
        <Avatar />
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
