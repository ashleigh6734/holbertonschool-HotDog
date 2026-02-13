import "./PetCard.css";
import { useState } from "react";
import ConfirmModal from "../../components/modals/ConfirmModal";

export default function PetCard() {
  // SHOW MODAL ON DELETE ACCOUNT
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="pet-card">
      <div className="pet-card-left">
        <img className="pet-img" src="src/assets/images/cat.jpg" alt="pet-1" />
        <h6 className="pet-name mb-0">Miss Poodle</h6>
      </div>
      <div className="pet-card-right">
        <h6>Overview</h6>

        <div className="pet-info-grid">
          <div className="pet-info-group">
            <p className="pet-info-title">D.O.B</p>
            <p className="pet-info-input">09/12/1995</p>
          </div>
          <div className="pet-info-group">
            <p className="pet-info-title">Age</p>
            <p className="pet-info-input">12</p>
          </div>
          <div className="pet-info-group">
            <p className="pet-info-title">Weight</p>
            <p className="pet-info-input">9kg</p>
          </div>
          <div className="pet-info-group">
            <p className="pet-info-title">Species</p>
            <p className="pet-info-input">Dog</p>
          </div>
          <div className="pet-info-group">
            <p className="pet-info-title">Breed</p>
            <p className="pet-info-input">Poodle</p>
          </div>
          <div className="pet-info-group">
            <p className="pet-info-title">Gender</p>
            <p className="pet-info-input">Female</p>
          </div>
        </div>

        <div className="pet-card-footer">
          <div className="notes-label">
            <span>Notes</span>
          </div>
          <div className="notes-value">23/01/2026</div>

          <div className="pet-card-actions">
            <button className="btn-yellow">Edit</button>
            <button
              className="btn-navy"
              onClick={() => {
                setShowModal(true);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <ConfirmModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        heading="Delete Pet"
        body={
          <>
            Are you sure you want to permanently remove this pet? <br />
          </>
        }
        secondaryButton="Close"
        primaryButton="Delete Pet"
      />
    </div>
  );
}
