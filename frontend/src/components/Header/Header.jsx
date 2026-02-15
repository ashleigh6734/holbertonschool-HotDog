import React from "react";
import "./Hooter.css";

function Header() {
  return (
    <header>
      <h1>HotDog</h1>

      <nav>
        <ul className="nav-links">
          <li><a href="/">List Your Practice</a></li>
          <li><a href="/About">About Us</a></li>
          <li><a href="/Services">Services</a></li>
        </ul>
      </nav>

      <div className="access-btn">
        <button className="login">Login</button>
        <button className="signup">Sign Up</button>
      </div>

    </header>
  );
}

export default Header;

