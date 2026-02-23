import { Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { deleteUser } from "../../api/user.js";

import FormLabel from "../../components/Form/FormLabel.jsx";
import FormNav from "../../components/Form/FormNav.jsx";
import SuccessToast from "../../components/toasts/SuccessToast.jsx";
import ConfirmModal from "../../components/modals/ConfirmModal.jsx";
import Header from "../../components/Header/Header.jsx";
import "../../components/Header/Header.css";
import "./UserProfile.css";
import "../../styles/common.css";

export default function UserProfile() {
  const { user } = useContext(AuthContext);

  //ACTIVE TAB STATE
  const [activeTab, setActiveTab] = useState("details"); //details | password | account

  // EDIT/SAVE STATE
  const [editMode, setEditMode] = useState(false);
  const closeEditMode = () => setEditMode(false);
  const openEditMode = () => setEditMode(true);

  // SHOW TOAST ON PASSWORD SAVE
  const [showToast, setShowToast] = useState(false);

  // SHOW MODAL ON DELETE ACCOUNT
  const [showModal, setShowModal] = useState(false);

  // useEffect((user) => {
  //   const token = localStorage.getItem("token");

  //   const handleDelete = async (token) => {
  //     try {
  //       const response = await deleteUser(user, token);
  //       console.log(response, "response");
  //       console.log(user.id, "user_id");
  //     } catch (error) {
  //       console.error(error.message, "error");
  //     }
  //   };
  //   handleDelete();
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token, "token");
    console.log(user.id, "user_id");

    const deleteUser = async (token) => {
      const API_DELETE_URL = `http://localhost:5000/api/users/${user.id}`;
      //console.log(API_DELETE_URL, "login endpoint");
      const response = await fetch(`${API_DELETE_URL}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete user");
      }

      return data;
    };
    deleteUser();
  });

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
                      value={user.first_name}
                    />
                    <FormLabel
                      className="justify-left mb-1"
                      controlId="userLastName"
                      type="lastname"
                      name="Last Name"
                      disabled={!editMode}
                      readOnly={!editMode}
                      value={user.last_name}
                    />
                    <FormLabel
                      className="justify-left mb-1"
                      controlId="userEmail"
                      type="email"
                      name="Email"
                      disabled={!editMode}
                      readOnly={!editMode}
                      value={user.email}
                    />
                    <FormLabel
                      className="justify-left mb-1"
                      controlId="userMobile"
                      type="mobile"
                      name="Mobile Number"
                      disabled={!editMode}
                      readOnly={!editMode}
                      // value={user.phone_number}
                    />
                    <FormLabel
                      className="justify-left mb-3"
                      controlId="emergencyNumber"
                      type="emergencyNumber"
                      name="Emergency Phone Number"
                      disabled={!editMode}
                      readOnly={!editMode}
                      // value={user.emergency_number}
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
            )}

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
