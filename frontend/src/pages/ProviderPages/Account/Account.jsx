import { Form } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext.jsx";
import { deleteUser } from "../../../api/user.js";
import FormLabel from "../../../components/Form/FormLabel.jsx";
import FormNav from "../../../components/Form/FormNav.jsx";
import SuccessToast from "../../../components/toasts/SuccessToast.jsx";
import ConfirmModal from "../../../components/modals/ConfirmModal.jsx";
import Appointments from "../../Appointments/Appointments.jsx";
import "./account.css";
import "../../../styles/common.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Account() {
  const { user, logout } = useContext(AuthContext);
  
  // State
  const [provider, setProvider] = useState(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  // Load Provider Data
  useEffect(() => {
    const loadProvider = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/api/providers/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 404) {
          setNeedsOnboarding(true);
          setProvider({
            name: "",
            phone: user.phone_number || "",
            address: "",
            description: "",
            opening_time: "",
            closing_time: "",
            slot_duration: 30,
            img_url: "",
            logo_url: "",
          });
        } else {
          const data = await res.json();
          setProvider(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (user) loadProvider();
  }, [user]);

  // Update a single provider field
  const updateField = (field, value) => {
    setProvider((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
  };

  // Save provider details
  const saveProvider = async () => {
    if (!dirty) return setEditMode(false);
    const token = localStorage.getItem("token");
    setSaving(true);

    try {
      const url = provider.id
        ? `${API_URL}/api/providers/${provider.id}`
        : `${API_URL}/api/providers`;
      const method = provider.id ? "PATCH" : "POST";

      const payload = {
        name: provider.name || "",
        phone: provider.phone || "",
        address: provider.address || "",
        description: provider.description || "",
        opening_time: provider.opening_time || "",
        closing_time: provider.closing_time || "",
        slot_duration: provider.slot_duration || 30,
        img_url: provider.img_url || "",
        logo_url: provider.logo_url || "",
      };

      console.log("Saving payload:", payload);

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Returned provider from backend:", data);

      if (data.id) {
      setProvider(data); 
      }
      
      setDirty(false);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  // Update password
  const updatePassword = async () => {
    setPasswordError("");
    if (!newPassword) return setPasswordError("Password cannot be empty");
    if (newPassword !== confirmPassword) return setPasswordError("Passwords do not match");

    try {
      const token = localStorage.getItem("token");

      console.log("Token:", token);

      const res = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update password");
      }

      setShowPasswordSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setShowPasswordSuccess(false), 1500);
    } catch (err) {
      setPasswordError(err.message);
    }
  };

  // Delete account
  const deleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/api/users/${user.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowDeleteSuccess(true);
      setTimeout(logout, 1500);
    } catch (err) {
      console.error(err);
      alert("Failed to delete account");
    }
  };

  if (!user || !provider) return <p>Loading...</p>;

  return (
    <div className="account-profile-background">
      <div className="account-section">
        <div className="account--profile-container">
          <h1 className="account-mb-5">Business Profile</h1>
          <div className="form">
            <div className="form-nav">
              <h3 style={{ padding: "30px 16px", color: "#1f3a5f", fontWeight: 800 }}>Account</h3>
              <FormNav
                tabs={[
                  { label: "Business Details", value: "details" },
                  { label: "Manage Account", value: "account" },
                  { label: "Business Page Preview", value: "preview" },
                ]}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>

            <div className="form-panel">
              {/* DETAILS TAB */}
              {activeTab === "details" && (
                <Form>
                  <FormLabel
                    name="Business Name"
                    value={provider.name}
                    disabled={!editMode}
                    onChange={(e) => updateField("name", e.target.value)}
                  />
                  <FormLabel
                    name="Phone"
                    value={provider.phone}
                    disabled={!editMode}
                    onChange={(e) => updateField("phone", e.target.value)}
                  />
                  <FormLabel
                    name="Address"
                    value={provider.address}
                    disabled={!editMode}
                    onChange={(e) => updateField("address", e.target.value)}
                  />
                  <Form.Group className="form-label-group">
                    <Form.Label>Description</Form.Label>
                    <textarea
                      className="form-control business-description"
                      value={provider.description}
                      disabled={!editMode}
                      onChange={(e) => updateField("description", e.target.value)}
                    />
                  </Form.Group>
                  <FormLabel
                    type="time"
                    name="Opening Time"
                    value={provider.opening_time}
                    disabled={!editMode}
                    onChange={(e) => updateField("opening_time", e.target.value)}
                  />
                  <FormLabel
                    type="time"
                    name="Closing Time"
                    value={provider.closing_time}
                    disabled={!editMode}
                    onChange={(e) => updateField("closing_time", e.target.value)}
                  />

                  {editMode ? (
                    <button type="button" className="btn-style button-yellow" onClick={saveProvider} disabled={saving}>
                      {saving ? "Saving..." : "Save Details"}
                    </button>
                  ) : (
                    <button type="button" className="btn-style button-yellow" onClick={() => setEditMode(true)}>
                      Edit Details
                    </button>
                  )}
                </Form>
              )}

              {/* ACCOUNT TAB */}
              {activeTab === "account" && (
                <>
                  <h6>Change Password</h6>
                  <Form>
                    <FormLabel
                      name="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <FormLabel
                      name="Confirm New Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Form>
                  {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
                  <button type="button" className="btn-style button-yellow" onClick={updatePassword}>
                    Change Password
                  </button>

                  <hr style={{ margin: "35px 0" }} />

                  <h6>Delete Account</h6>
                  <p>This action cannot be undone and all provider data will be permanently removed.</p>
                  <button type="button" className="btn-style button-navy" onClick={() => setShowDeleteModal(true)}>
                    Delete Account
                  </button>
                </>
              )}

              {/* BUSINESS PAGE PREVIEW TAB */}
              {activeTab === "preview" && (
                <div className="form-block">
                  <h6>Business Page Preview</h6>
                    <div className="preview-wrapper"> 
                      <Appointments previewMode providerData={provider} />
                    </div>
                </div>
              )}

              {showDeleteSuccess && (
                <div className="success-modal">
                  <div className="success-modal-content">
                    <h2>Account Deleted</h2>
                    <p>Your account has been permanently deleted.</p>
                  </div>
                </div>
              )}

              {showPasswordSuccess && (
                <div className="success-modal">
                  <div className="success-modal-content">
                    <h2>Password Updated</h2>
                    <p>Your password was successfully updated.</p>
                  </div>
                </div>
              )}

              <ConfirmModal
                show={showDeleteModal}
                handleClose={() => setShowDeleteModal(false)}
                handlePrimary={deleteAccount}
                heading="Delete Account"
                body="Are you sure you want to permanently delete your account?"
                primaryButton="Delete Account"
                secondaryButton="Cancel"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
