import { Form } from "react-bootstrap";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { deleteUser } from "../../api/user.js";
import { updateUser } from "../../api/user.js";

import FormLabel from "../../components/Form/FormLabel.jsx";
import FormNav from "../../components/Form/FormNav.jsx";
import SuccessToast from "../../components/toasts/SuccessToast.jsx";
import ConfirmModal from "../../components/modals/ConfirmModal.jsx";
import "../../components/Header/Header.css";
import "./UserProfile.css";
import "../../styles/common.css";

export default function UserProfile() {
  const { user, logout } = useContext(AuthContext);
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [mobileNumber, setMobileNumber] = useState(user?.phone_number || "");
  const [emergencyNumber, setEmergencyNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //ACTIVE TAB STATE
  const [activeTab, setActiveTab] = useState("details"); //details | password | account

  // EDIT/SAVE STATE
  const [editMode, setEditMode] = useState(false);
  const closeEditMode = () => setEditMode(false);
  const openEditMode = () => setEditMode(true);

  // SHOW TOAST ON PASSWORD SAVE
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);

  // SHOW TOAST ON DELETE SUCCESS
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  // SHOW MODAL ON DELETE ACCOUNT
  const [showModal, setShowModal] = useState(false);

  // HANDLE UPDATE USER
  const handleUpdateUser = async (
    firstName,
    lastName,
    email,
    mobileNumber,
    // emergencyNumber,
  ) => {
    const token = localStorage.getItem("token");
    const body = {};
    try {
      if (firstName) {
        body.first_name = firstName;
      }
      if (lastName) {
        body.last_name = lastName;
      }
      if (email) {
        body.email = email;
      }
      if (mobileNumber) {
        body.phone_number = mobileNumber;
      }
      console.log(body);
      const result = await updateUser(token, user, body);
      console.log(result.message);
    } catch (error) {
      console.error(error);
    }
  };

  // HANDLE PASSWORD STATE
  const handleUpdatePassword = async () => {
    const token = localStorage.getItem("token");
    const body = {};
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      if (newPassword) {
        body.password = newPassword;
      }
      const result = await updateUser(token, user, body);
      console.log(result.message);
      setShowPasswordSuccess(true);
    } catch (error) {
      console.error(error);
    }
  };

  // HANDLE DELETE USER
  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found");
      return;
    }

    try {
      const result = await deleteUser(user, token);
      console.log(result.message);
      setShowModal(false);
      setShowDeleteSuccess(true);
      setTimeout(() => {
        logout(); // log the usr out after account is deleted
      }, 1500); // Delay logout for 1.5 seconds to show toast
    } catch (err) {
      console.error(err);
    }
  };

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
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                className="link-style"
              />
            </div>
          </div>
          <div className="form-panel">
            {activeTab === "details" && (
              <>
                <h6
                  id="mydetails"
                  style={{ fontWeight: 700, color: "#1f3a5f" }}
                >
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
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                      }}
                    />
                    <FormLabel
                      className="justify-left mb-1"
                      controlId="userLastName"
                      type="lastname"
                      name="Last Name"
                      disabled={!editMode}
                      readOnly={!editMode}
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                      }}
                    />
                    <FormLabel
                      className="justify-left mb-1"
                      controlId="userEmail"
                      type="email"
                      name="Email"
                      disabled={!editMode}
                      readOnly={!editMode}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                    <FormLabel
                      className="justify-left mb-1"
                      controlId="userMobile"
                      type="mobile"
                      name="Mobile Number"
                      disabled={!editMode}
                      readOnly={!editMode}
                      value={mobileNumber}
                      onChange={(e) => {
                        setMobileNumber(e.target.value);
                      }}
                    />
                    <FormLabel
                      className="justify-left mb-3"
                      controlId="emergencyNumber"
                      type="emergencyNumber"
                      name="Emergency Phone Number"
                      disabled={!editMode}
                      readOnly={!editMode}
                      // value={user.emergency_number}
                      onChange={(e) => {
                        setEmergencyNumber(e.target.value);
                      }}
                    />
                  </Form>

                  {editMode ? (
                    <div>
                      <button
                        onClick={() => {
                          closeEditMode();
                          handleUpdateUser(
                            firstName,
                            lastName,
                            email,
                            mobileNumber,
                          );
                        }}
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
              </>
            )}
            {activeTab === "password" && (
              <>
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
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                      }}
                    />
                    <FormLabel
                      className="justify-left mb-3"
                      controlId="confirmPassword"
                      type="password"
                      name="Confirm New Password"
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                      }}
                    />
                  </Form>
                  <button
                    className="btn-layout btn-yellow"
                    onClick={() => {
                      handleUpdatePassword(newPassword, confirmPassword);
                    }}
                  >
                    Change my password
                  </button>
                </div>
              </>
            )}

            {activeTab === "account" && (
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
                    We're sorry to see you go 😢 <br />
                    <br />
                    Note that this action cannot be undone and will result in a
                    loss of all data.
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
            )}

            <SuccessToast
              showToast={showDeleteSuccess}
              onClose={() => setShowDeleteSuccess(false)}
              message="Your account was deleted successfully!"
            />

            <SuccessToast
              showToast={showPasswordSuccess}
              onClose={() => setShowPasswordSuccess(false)}
              message="Your password was updated successfully!"
            />

            <ConfirmModal
              show={showModal}
              handleClose={() => setShowModal(false)}
              handlePrimary={handleDelete}
              heading="Delete Account"
              body={
                <>
                  Are you sure you want to permanently delete your account?{" "}
                  <br />
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
