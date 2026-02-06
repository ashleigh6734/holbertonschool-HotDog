import FormLabel from "../../components/Form/FormLabel";
import "./UserProfile.css";
import { Form, Button, Col, Row } from "react-bootstrap";

export default function UserProfile() {
  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1 className="mb-4">My Profile</h1>
        <div className="form">
          <div className="form-nav"></div>
          <div className="form-panel">
            <h6>My Details</h6>
            <div className="form-block mb-3">
              <Form>
                <FormLabel
                  className="justify-left mb-1"
                  controlId="userFirstName"
                  type="firstname"
                  name="First Name"
                  id="test"
                  disabled="true"
                  readOnly="true"
                />
                <FormLabel
                  className="justify-left mb-1"
                  controlId="userLastName"
                  type="lastname"
                  name="Last Name"
                  disabled="true"
                  readOnly="true"
                />
                <FormLabel
                  className="justify-left mb-1"
                  controlId="userEmail"
                  type="email"
                  name="Email"
                  disabled="true"
                  readOnly="true"
                />
                <FormLabel
                  className="justify-left mb-1"
                  controlId="userMobile"
                  type="mobile"
                  name="Mobile Number"
                  disabled="true"
                  readOnly="true"
                />
                <FormLabel
                  className="justify-left mb-3"
                  controlId="emergencyNumber"
                  type="secondaryNumber"
                  name="Secondary Phone Number"
                  disabled="true"
                  readOnly="true"
                />
              </Form>
              <button className="btn-layout btn-yellow">Edit</button>
              <button className="btn-layout btn-yellow">Save details</button>
            </div>
            <h6>Manage Password and Account</h6>
            <div className="form-block mb-3">
              <Form>
                <FormLabel
                  className="justify-left mb-1"
                  controlId="newPassword"
                  type="password"
                  name="New Password"
                />
                <FormLabel
                  className="justify-left mb-3"
                  controlId="confirmPassword"
                  type="password"
                  name="Confirm New Password"
                />
              </Form>
              <button className="btn-layout btn-yellow">
                Change my password
              </button>
            </div>

            <div className="form-block mb-3">
              <p>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, se
              </p>
              <button className="btn-layout btn-navy">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
