import "./Login.css";
import { Form, Button, Col, Row } from "react-bootstrap";

export default function Login() {
  return (
    <div className="form-card">
      <Form>
        <h3>Login</h3>

        <p muted>Access your dashboard now! </p>

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

        <Form.Group className="mb-3 justify-left" controlId="formEmail">
          <Form.Label>Email*</Form.Label>
          <Form.Control placeholder="Email" />
        </Form.Group>

        <Form.Group className="mb-3 justify-left" controlId="formPassword">
          <Form.Label>Password*</Form.Label>
          <Form.Control placeholder="Enter Password" />
        </Form.Group>

        <Button className="login-btn" variant="warning" type="logIn">
          Login
        </Button>

        <p className="sub-text justify-left">
          {" "}
          New to HotDog? <a href="#">Sign up</a>
        </p>
      </Form>
    </div>
  );
}
