import { Nav } from "react-bootstrap";
import "../../pages/UserProfile/UserProfile.css";

export default function FormNav({ nav1, nav2, nav3 }) {
  return (
    <Nav className="flex-column" activeKey="/home">
      <Nav.Link href="#mydetails">{nav1}</Nav.Link>
      <Nav.Link href="#mngpwd">{nav2}</Nav.Link>
      <Nav.Link href="#mngacc">{nav3}</Nav.Link>
    </Nav>
  );
}
