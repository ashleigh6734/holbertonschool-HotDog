import "./Register.css";
import { Form, Button, Col, Row } from "react-bootstrap";
// import ToggleSwitch from "../components/buttons/ToggleSwitch";

export default function Register() {
  return (
    <div className="form-card">
      <Form>
        {/* <ToggleSwitch /> */}

        <h3>Create a HotDog Account</h3>

        <p muted>
          Keep on top of your pet's appointments and create an account!{" "}
        </p>

        <p>Are you a provider?</p>
        {["radio"].map((type) => (
          <div key={`inline-${type}`} className="mb-3">
            <Form.Check
              inline
              label="Yes"
              name="group1"
              type={type}
              id={`inline-${type}-1`}
            />
            <Form.Check
              inline
              label="No"
              name="group1"
              type={type}
              id={`inline-${type}-2`}
            />
          </div>
        ))}

        <Row className="mb-3">
          <Form.Group
            className="justify-left"
            as={Col}
            controlId="formGridFirstName"
          >
            <Form.Label>First Name</Form.Label>
            <Form.Control type="firstname" placeholder="First Name" />
          </Form.Group>

          <Form.Group
            // className="justify-left"
            as={Col}
            controlId="formGridLastName"
          >
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="lastname" placeholder="Last Name" />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3 justify-left" controlId="formDOB">
          <Form.Label>Date of Birth</Form.Label>
          <Row>
            <Col xs={3}>
              <Form.Control type="text" placeholder="DD" maxLength={2} />
            </Col>
            <Col xs={3}>
              <Form.Control type="text" placeholder="MM" maxLength={2} />
            </Col>
            <Col xs={3}>
              <Form.Control type="text" placeholder="YYYY" maxLength={4} />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group className="mb-3 justify-left" controlId="formMobile">
          <Form.Label>Mobile Number</Form.Label>
          <Form.Control placeholder="Mobile Number" />
        </Form.Group>

        <Form.Group className="mb-3 justify-left" controlId="formEmail">
          <Form.Label>Email*</Form.Label>
          <Form.Control placeholder="Email" />
        </Form.Group>

        <Form.Group className="mb-3 justify-left" controlId="formPassword">
          <Form.Label>Password*</Form.Label>
          <Form.Control placeholder="Enter Password" />
          <Form.Text id="passwordHelpBlock" muted>
            Your password must be 8-20 characters long.
          </Form.Text>
        </Form.Group>

        <Form.Group
          className="mb-3 justify-left"
          controlId="formConfirmPassword"
        >
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control placeholder="Re-enter Password" />
        </Form.Group>

        <Button className="signup-btn" variant="warning" type="signUp">
          Sign Up
        </Button>

        <p className="sub-text justify-left">
          {" "}
          Already have an account? <a href="#">Login</a>
        </p>
      </Form>
    </div>
  );
}
