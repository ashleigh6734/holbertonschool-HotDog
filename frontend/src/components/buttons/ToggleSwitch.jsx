import { ButtonGroup, Button } from "react-bootstrap";
import "../../styles/buttons/ToggleSwitch.css";

export default function ToggleSwitch({ active = "login", onChange }) {
  const handleClick = (value) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <ButtonGroup className="auth-toggle">
      <Button
        className={`auth-btn ${active === "login" ? "active" : ""}`}
        onClick={() => handleClick("login")}
      >
        Login
      </Button>

      <Button
        className={`auth-btn ${active === "signup" ? "active" : ""}`}
        onClick={() => handleClick("signup")}
      >
        Sign Up
      </Button>
    </ButtonGroup>
  );
}
