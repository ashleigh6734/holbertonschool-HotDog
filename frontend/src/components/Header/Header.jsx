import GuestHeader from "./GuestHeader";
import UserHeader from "./UserHeader";
import ProviderNav from "./ProviderNav.jsx";
import Avatar from "../avatar/Avatar.jsx";
import "./Header.css";
import { Link } from "react-router-dom";

import blueLogo from "../../assets/logo/hotdog_logo_blue_background.svg";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

function Header() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // prevents flicker

  return (
    <header>
      <Link to={user?.role === "user" ? "/dashboard" : "/"}>
        <img src={blueLogo} alt="HotDog Logo" className="hotdog-logo" />
      </Link>

      <div className="header-content">
        {!user && <GuestHeader />}
        {user?.role === "user" && <UserHeader />}
        {user?.role === "provider" && <ProviderNav />}
      </div>
    </header>
  );
}

export default Header;
