import "./Login.css";
import { Form, Button, Col, Row } from "react-bootstrap";
import FormLabel from "../../components/Form/FormLabel";
import FormRadio from "../../components/Form/FormRadio";

export default function Login() {
  return (
    <div className="form-card">
      <Form>
        <h2>Login</h2>

        <p muted>Access your dashboard now! </p>

        <p>Are you a provider?</p>
        <FormRadio name="group1" firstLabel="Yes" secondLabel="No" />

        <FormLabel
          className="justify-left mb-3"
          controlId="loginEmail"
          type="email"
          placeholder="Email"
          name="Email*"
        />

        <FormLabel
          className="justify-left mb-4"
          controlId="loginPassword"
          type="password"
          placeholder="Password"
          name="Password*"
        />

        <Button className="login-btn" variant="warning" type="logIn">
          Login
        </Button>

        <p className="sub-text justify-left">
          New to HotDog? <a href="#">Sign up</a>
        </p>
      </Form>
    </div>
  );
}
