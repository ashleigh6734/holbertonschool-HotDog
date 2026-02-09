import FormLabel from "../../components/Form/FormLabel";
import FormNav from "../../components/Form/FormNav";
import "./UserProfile.css";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useState } from "react";

export default function UserProfile() {
  const [editMode, setEditMode] = useState(false);
  const closeEditMode = () => setEditMode(false);
  const openEditMode = () => setEditMode(true);

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1 className="mb-5">My Profile</h1>
        <div className="form">
          <div className="form-nav">
            <div>
              <h3 style={{ paddingLeft: "16px", paddingTop: "30px" }}>
                Account
              </h3>
              <FormNav
                nav1="My Details"
                nav2="Manage Password"
                nav3="Manage Account"
                className="link-style"
              />
            </div>
          </div>
          <div className="form-panel">
            <h6 id="mydetails">My Details</h6>
            <div className="form-block mb-3">
              <Form>
                <FormLabel
                  className="justify-left mb-1"
                  controlId="userFirstName"
                  type="firstname"
                  name="First Name"
                  disabled={!editMode}
                  readOnly={!editMode}
                />
                <FormLabel
                  className="justify-left mb-1"
                  controlId="userLastName"
                  type="lastname"
                  name="Last Name"
                  disabled={!editMode}
                  readOnly={!editMode}
                />
                <FormLabel
                  className="justify-left mb-1"
                  controlId="userEmail"
                  type="email"
                  name="Email"
                  disabled={!editMode}
                  readOnly={!editMode}
                />
                <FormLabel
                  className="justify-left mb-1"
                  controlId="userMobile"
                  type="mobile"
                  name="Mobile Number"
                  disabled={!editMode}
                  readOnly={!editMode}
                />
                <FormLabel
                  className="justify-left mb-3"
                  controlId="emergencyNumber"
                  type="secondaryNumber"
                  name="Secondary Phone Number"
                  disabled={!editMode}
                  readOnly={!editMode}
                />
              </Form>
              {editMode ? (
                <div>
                  <button
                    onClick={closeEditMode}
                    className="btn-layout btn-yellow"
                  >
                    Save details
                  </button>
                </div>
              ) : (
                <button
                  onClick={openEditMode}
                  className="btn-layout btn-yellow"
                >
                  Edit Details
                </button>
              )}
            </div>
            <h6 id="mngpwd" style={{ margin: "0px" }}>
              Manage Password
            </h6>
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
            <Form>
              <h6 id="mngacc">Manage Account</h6>
              <div className="form-block mb-3">
                <p>
                  We're sorry to see you go! Note that this action cannot be
                  undone and will result to a loss of all data.
                </p>
                <button className="btn-layout btn-navy">Delete Account</button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
