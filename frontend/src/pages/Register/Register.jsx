import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import "../../styles/common.css";
import { Form, Button, Col, Row } from "react-bootstrap";
import FormLabel from "../../components/Form/FormLabel";
import FormRadio from "../../components/Form/FormRadio";
import ToggleSwitch from "../../components/buttons/ToggleSwitch";
import { registerUser } from "../../api/auth";

export default function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    console.log("FORM DATA:", formData);
    try {
      setLoading(true);

      const { confirmPassword, ...dataToSend } = formData;

      await registerUser(dataToSend);

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="form-card">
        <Form onSubmit={handleSubmit}>
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
              type="text"
              placeholder="First Name"
              name="First Name*"
              inputName="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
            <FormLabel
              className="justify-left"
              controlId="formGridLastName"
              type="text"
              placeholder="Last Name"
              name="Last Name*"
              inputName="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </Row>
          <FormLabel
            className="justify-left mb-3"
            controlId="formMobileNumber"
            type="text"
            placeholder="Mobile Number"
            name="Mobile Number"
            inputName="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />
          <FormLabel
            className="justify-left mb-3"
            controlId="formEmail"
            type="email"
            placeholder="Email"
            name="Email*"
            inputName="email"
            value={formData.email}
            onChange={handleChange}
          />
          <FormLabel
            className="justify-left mb-3"
            controlId="formPassword"
            type="password"
            placeholder="Enter Password"
            name="Password*"
            inputName="password"
            value={formData.password}
            onChange={handleChange}
          />
          <FormLabel
            className="justify-left mb-3"
            controlId="formConfirmPassword"
            type="password"
            placeholder="Re-enter Password"
            name="Confirm Password*"
            inputName="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <Button className="signup-btn" type="submit">
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
