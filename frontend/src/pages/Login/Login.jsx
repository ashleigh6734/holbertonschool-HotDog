import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { Form, Button } from "react-bootstrap";
import FormLabel from "../../components/Form/FormLabel";
import FormRadio from "../../components/Form/FormRadio";
import ToggleSwitch from "../../components/buttons/ToggleSwitch";
import { loginUser } from "../../api/auth";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // State for form inputs and error messages
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle change update
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // reset previous errors

    console.log("FORM DATA:", formData);

    try {
      setLoading(true);
      
      const response = await loginUser(formData);

      // use context login instead of manual Storage
        login(response.access_token);
        navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
      console.log(err);
    }
  }

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
          <h2 style={{ color: "#1f3a5f", fontWeight: 700 }}>Login</h2>
          <p className="mb-3 sub-text">Access your dashboard now! </p>
          <FormLabel
            className="justify-left mb-3"
            controlId="loginEmail"
            type="email"
            placeholder="Email"
            name="Email"
            inputName="email"
            value={formData.email}
            onChange={handleChange}
          />
          <FormLabel
            className="justify-left mb-4"
            controlId="loginPassword"
            type="password"
            placeholder="Password"
            name="Password"
            inputName="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button className="login-btn" type="submit">
            Login
          </Button>
          <p className="sub-text justify-left">
            New to HotDog? <a href="../register">Sign up</a>
          </p>
        </Form>
      </div>
    </div>
  );
}
