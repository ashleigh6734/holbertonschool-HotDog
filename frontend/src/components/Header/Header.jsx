import GuestHeader from "./GuestHeader";
import UserHeader from "./UserHeader";
import Avatar from "../avatar/Avatar.jsx";
import "./Header.css";

import blueLogo from "../../assets/logo/hotdog_logo_blue_background.svg";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

function Header() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // prevents flicker

  return (
    <header>
      <img src={blueLogo} alt="HotDog Logo" className="hotdog-logo" />

      <div className="header-content">
        {user ? <UserHeader /> : <GuestHeader />}
      </div>
    </header>
  );
}

export default Header;
