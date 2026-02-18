import React from "react";
import "./Footer.css";
import yellowLogo from "../../assets/logo/hotdog_logo_blue_background.svg";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

          <img
            src={yellowLogo}
            alt="HotDog Logo"
            className="footer-logo"
          />

        <div className="footer-columns">
          <ul className="footer-links">
            <li className="footer-title">Patient</li>
            <li><a href="/find-practice">Find a Practice</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/pets">My Pet(s)</a></li>
            <li><a href="/account">My Account</a></li>
          </ul>

          <ul className="footer-links">
            <li className="footer-title">Practices</li>
            <li><a href="/practice-login">Dashboard Login</a></li>
          </ul>

          <ul className="footer-links">
            <li className="footer-title">HotDog</li>
            <li><a href="/about-us">About Us</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/terms">Terms & Conditions</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div>

      </div>
    </footer>
  );
}

export default Footer;