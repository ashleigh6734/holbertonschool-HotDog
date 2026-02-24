import "./PetCard.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/modals/ConfirmModal";
import BasicPopover from "../popovers/BasicPopover";

export default function PetCard({ pet }) {
  const navigate = useNavigate();
  // SHOW MODAL ON DELETE ACCOUNT
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/pets/${pet.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete pet");
      }

      setShowModal(false);

      window.location.reload();

    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const formatEnum = (value) => {
    if (!value) return "N/A";
  
    return value
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

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
            <p className="pet-info-input">{formatEnum(pet?.species)}</p>
          </div>

          <div className="pet-info-group">
            <p className="pet-info-title">Breed</p>
            <p className="pet-info-input">{formatEnum(pet?.breed)}</p>
          </div>

          <div className="pet-info-group">
            <p className="pet-info-title">Gender</p>
            <p className="pet-info-input">{formatEnum(pet?.gender)}</p>
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
        handlePrimary={handleDelete}
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
