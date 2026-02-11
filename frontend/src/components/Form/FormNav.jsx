import { Nav } from "react-bootstrap";
import "../../pages/UserProfile/UserProfile.css";

export default function FormNav({ nav1, nav2, nav3, activeTab, setActiveTab }) {
  return (
    <Nav className="flex-column">
      <Nav.Link
        className={activeTab === "details" ? "active" : ""}
        onClick={() => setActiveTab("details")}
      >
        {nav1}
      </Nav.Link>
      <Nav.Link
        className={activeTab === "password" ? "active" : ""}
        onClick={() => setActiveTab("password")}
      >
        {nav2}
      </Nav.Link>
      <Nav.Link
        className={activeTab === "account" ? "active" : ""}
        onClick={() => setActiveTab("account")}
      >
        {nav3}
      </Nav.Link>
    </Nav>
  );
}
