import "./Login.css";
import { Form, Button } from "react-bootstrap";
import FormLabel from "../../components/Form/FormLabel";
import FormRadio from "../../components/Form/FormRadio";
import ToggleSwitch from "../../components/buttons/ToggleSwitch";

export default function Login() {
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
          <h2>Login</h2>
          <p className="mb-3 sub-text">Access your dashboard now! </p>
          <FormLabel
            className="justify-left mb-3"
            controlId="loginEmail"
            type="email"
            placeholder="Email"
            name="Email"
          />
          <FormLabel
            className="justify-left mb-4"
            controlId="loginPassword"
            type="password"
            placeholder="Password"
            name="Password"
          />
          <Button className="login-btn" variant="warning" type="logIn">
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
