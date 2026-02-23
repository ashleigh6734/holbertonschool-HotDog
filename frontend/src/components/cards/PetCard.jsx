import "./PetCard.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/modals/ConfirmModal";
import BasicPopover from "../popovers/BasicPopover";

export default function PetCard({ pet }) {
  // SHOW MODAL ON DELETE ACCOUNT
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="pet-card">
      <div className="pet-card-left">
        <img className="pet-img" src="src/assets/images/cat.jpg" alt="pet-1" />
        <h6 className="pet-name mb-0">{pet?.name}</h6>
      </div>

      <div className="pet-card-right">
        <h6>Overview</h6>

        <div className="pet-info-grid">
          <div className="pet-info-group">
            <p className="pet-info-title">D.O.B</p>
            <p className="pet-info-input">
              {pet?.date_of_birth
                ? new Date(pet.date_of_birth).toLocaleDateString()
                : "N/A"}
            </p>
          </div>

          <div className="pet-info-group">
            <p className="pet-info-title">Age</p>
            <p className="pet-info-input">{pet?.age || "N/A"}</p>
          </div>

          <div className="pet-info-group">
            <p className="pet-info-title">Weight</p>
            <p className="pet-info-input">
              {pet?.weight ? `${pet.weight}kg` : "N/A"}
            </p>
          </div>

          <div className="pet-info-group">
            <p className="pet-info-title">Species</p>
            <p className="pet-info-input">{pet?.species || "N/A"}</p>
          </div>

          <div className="pet-info-group">
            <p className="pet-info-title">Breed</p>
            <p className="pet-info-input">{pet?.breed || "N/A"}</p>
          </div>

          <div className="pet-info-group">
            <p className="pet-info-title">Gender</p>
            <p className="pet-info-input">{pet?.gender || "N/A"}</p>
          </div>
        </div>

        <div className="pet-card-footer">
          <div className="notes-label">
            <BasicPopover
              placement="right"
              heading="Notes"
              body="See useful notes and reminders about your pet here!"
              buttonText="See Notes"
              headerClassName="popover-header"
              buttonClassName="popover-button"
              bodyClassName="popover-body"
            />
          </div>

          <div className="pet-card-actions">
            <button
              className="btn-yellow"
              onClick={() => navigate(`/edit-pet/${pet.id}`)}
            >
              Edit
            </button>
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
