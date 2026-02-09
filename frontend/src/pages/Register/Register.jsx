import "./Register.css";
import "../../styles/common.css";
import { Form, Button, Col, Row } from "react-bootstrap";
import FormLabel from "../../components/Form/FormLabel";
import FormRadio from "../../components/Form/FormRadio";
import ToggleSwitch from "../../components/buttons/ToggleSwitch";

export default function Register() {
  return (
    <div className="auth-page">
      <div className="form-card">
        <Form>
          <ToggleSwitch
            firstRadio={"Login"}
            firstPath={"/login"}
            secondRadio={"Sign Up"}
            secondPath={"/register"}
          />
          <h2 style={{ color: "#1f3a5f", fontWeight: 700 }}>
            Create a HotDog Account
          </h2>
          <p className="mb-5 sub-text">
            Keep on top of your pet's appointments and create an account!{" "}
          </p>
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
          <Button className="signup-btn" type="signUp">
            Sign Up
          </Button>
          <p className="sub-text justify-left">
            {" "}
            Already have an account? <a href="../login">Login</a>
          </p>
        </Form>
      </div>
    </div>
  );
}
