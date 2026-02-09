import { Form } from "react-bootstrap";
import { useState } from "react";
import FormLabel from "../../components/Form/FormLabel";
import FormNav from "../../components/Form/FormNav";
import SuccessToast from "../../components/toasts/successToast";
import ConfirmModal from "../../components/modals/ConfirmModal";
import "./UserProfile.css";
import "../../styles/common.css";

export default function UserProfile() {
  // EDIT/SAVE STATE
  const [editMode, setEditMode] = useState(false);
  const closeEditMode = () => setEditMode(false);
  const openEditMode = () => setEditMode(true);

  // SHOW TOAST ON PASSWORD SAVE
  const [showToast, setShowToast] = useState(false);

  // SHOW MODAL ON DELETE ACCOUNT
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1 className="mb-5" style={{ fontWeight: "800", color: "#1f3a5f" }}>
          My Profile
        </h1>
        <div className="form">
          <div className="form-nav">
            <div>
              <h3
                style={{
                  paddingLeft: "16px",
                  paddingTop: "30px",
                  color: "#1f3a5f",
                  fontWeight: "800",
                }}
              >
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
            <h6 id="mydetails" style={{ fontWeight: 700, color: "#1f3a5f" }}>
              My Details
            </h6>
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

            <h6
              id="mngpwd"
              style={{ margin: "0px", fontWeight: 700, color: "#1f3a5f" }}
            >
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
              <button
                className="btn-layout btn-yellow"
                onClick={() => {
                  setShowToast(true);
                }}
              >
                Change my password
              </button>
            </div>

            <Form>
              <h6
                id="mngacc"
                style={{ margin: "0px", fontWeight: 700, color: "#1f3a5f" }}
                className="mb-3"
              >
                Manage Account
              </h6>
              <div className="form-block mb-3">
                <p>
                  We're sorry to see you go! Note that this action cannot be
                  undone and will result to a loss of all data.
                </p>
                <button
                  type="button"
                  className="btn-layout btn-navy"
                  onClick={() => {
                    setShowModal(true);
                  }}
                >
                  Delete Account
                </button>
              </div>
            </Form>

            <SuccessToast
              showToast={showToast}
              onClose={() => setShowToast(false)}
              message="Your password was updated successfully!"
            />

            <ConfirmModal
              show={showModal}
              handleClose={() => setShowModal(false)}
              heading="Delete Account"
              body={
                <>
                  Are you sure you want to permanently delete your account?{" "}
                  <br />
                  All data will be erased after 30 days.
                </>
              }
              secondaryButton="Close"
              primaryButton="Delete Account"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
