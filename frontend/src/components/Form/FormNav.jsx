import { Nav } from "react-bootstrap";

export default function FormNav({ nav1, nav2, nav3 }) {
  return (
    <Nav className="flex-column" activeKey="/home">
      <Nav.Link href="#mydetails">{nav1}</Nav.Link>
      <Nav.Link eventKey="#mngpwd">{nav2}</Nav.Link>
      <Nav.Link eventKey="#mngacc">{nav3}</Nav.Link>
    </Nav>
  );
}
