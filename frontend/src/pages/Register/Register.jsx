import "./Register.css";
import { Form, Button, Col, Row } from "react-bootstrap";
import FormLabel from "../../components/Form/FormLabel";
import FormRadio from "../../components/Form/FormRadio";
import ToggleSwitch from "../../components/buttons/ToggleSwitch";

export default function Register() {
  return (
    <div className="form-card">
      <Form>
        <ToggleSwitch firstRadio="Login" secondRadio="Sign Up" />

        <h2>Create a HotDog Account</h2>

        <p>Keep on top of your pet's appointments and create an account! </p>

        <p>Are you a provider?</p>

        <FormRadio name="group1" firstLabel="Yes" secondLabel="No" />

        <Row className="mb-3">
          <FormLabel
            className="justify-left"
            controlId="formGridFirstName"
            type="firstname"
            placeholder="First Name"
            name="First Name*"
          />

          <FormLabel
            className="justify-left"
            controlId="formGridLastName"
            type="lastname"
            placeholder="Last Name"
            name="Last Name*"
          />
        </Row>

        {/* <Form.Group className="mb-3 justify-left" controlId="formDOB">
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
        </Form.Group> */}

        <FormLabel
          className="justify-left mb-3"
          controlId="formMobileNumber"
          type="mobilenumber"
          placeholder="Mobile Number"
          name="Mobile Number"
        />

        <FormLabel
          className="justify-left mb-3"
          controlId="formEmail"
          type="email"
          placeholder="Email"
          name="Email*"
        />

        <FormLabel
          className="justify-left mb-3"
          controlId="formPassword"
          type="password"
          placeholder="Enter Password"
          name="Password*"
        />

        <FormLabel
          className="justify-left mb-3"
          controlId="formConfirmPassword"
          type="password"
          placeholder="Re-enter Password"
          name="Confirm Password*"
        />

        <Button className="signup-btn" variant="warning" type="signUp">
          Sign Up
        </Button>

        <p className="sub-text justify-left">
          {" "}
          Already have an account? <a href="../login">Login</a>
        </p>
      </Form>
    </div>
  );
}
