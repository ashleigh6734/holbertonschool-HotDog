import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditPetDetails.css";
import { getPetById } from "../../api/pet";
import catImage from "../../assets/images/cat_default.png";
import dogImage from "../../assets/images/dog_default.png";
import ConfirmModal from "../../components/modals/ConfirmModal";

const API_URL = import.meta.env.VITE_API_URL;

export default function EditPetDetails() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    gender: "",
    desexed: false,
    date_of_birth: "",
    weight: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const breedMap = {
    dog: [
      { value: "labrador", label: "Labrador" },
      { value: "golden_retriever", label: "Golden Retriever" },
      { value: "german_shepherd", label: "German Shepherd" },
      { value: "bulldog", label: "Bulldog" },
      { value: "mixed", label: "Mixed" },
    ],
    cat: [
      { value: "domestic_shorthair", label: "Domestic Shorthair" },
      { value: "domestic_longhair", label: "Domestic Longhair" },
      { value: "bengal", label: "Bengal" },
      { value: "siamese", label: "Siamese" },
      { value: "mixed", label: "Mixed" },
    ],
  };

  const breedOptions = breedMap[formData.species] || [];

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await fetch(`${API_URL}/api/pets/${petId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch pet");
        }

        const data = await res.json();
        setPet(data);
        setFormData({
          ...data,
          species: data.species?.toLowerCase() || "",
          gender: data.gender?.toLowerCase() || "",
          breed: data.breed?.toLowerCase() || "",
        });
      } catch (err) {
        console.error(err);
        setError("Could not load pet");
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      if (name === "species") {
        return {
          ...prev,
          species: value,
          breed: "", // reset breed when species changes
        };
      }

      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_URL}/api/pets/${petId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...formData,
          species: formData.species?.toLowerCase(),
          gender: formData.gender?.toLowerCase(),
          breed: formData.breed,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update pet");
      }

      const updatedPet = await res.json();
      console.log("Updated:", updatedPet);

      alert("Pet information saved successfully!");
      navigate("/pets");
    } catch (err) {
      console.error(err);
      setError("Could not save changes");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(`${API_URL}/api/pets/${petId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete pet");
      }

      console.log("Pet deleted successfully");
      alert("Pet deleted successfully!");
      navigate("/pets");
    } catch (err) {
      console.error(err);
      setError("Could not delete pet");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) return <div className="edit-pet-loading">Loading...</div>;

  const getPetImage = () => {
    if (pet?.img_url) return pet.img_url;

    const species = formData.species?.toLowerCase();

    if (species === "cat") return catImage;
    if (species === "dog") return dogImage;

    return dogImage;
  };

  return (
    <div className="edit-pet-container">
      <ConfirmModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handlePrimary={handleDeleteConfirm}
        heading="Delete Pet"
        body="Are you sure you want to permanently remove this pet?"
        secondaryButton="Close"
        primaryButton="Delete Pet"
      />
      
      <div className="edit-pet-header">
        <h1 className="edit-pet-title">Edit {pet?.name || "Pet"} Details</h1>
      </div>

      <div className="edit-pet-contents-container">
        <button className="return-button" onClick={handleCancel}>
          &lt; Back
        </button>
        
        {error && <div className="error-message">{error}</div>}

        <div className="edit-pet-content">
          {/* Pet Card Section */}
          <div className="pet-card-section">
            <div className="pet-profile">
              <img
                className="pet-avatar"
                src={getPetImage()}
                alt={`${pet?.name || "Pet"} avatar`}
              />
              <h3 className="pet-card-name">{formData.name}</h3>
              {pet?.date_of_birth && (
                <div className="pet-info-row">
                  <div className="pet-info-item">
                    <p className="pet-info-label">DOB</p>
                    <p className="pet-info-value">{pet.date_of_birth}</p>
                  </div>
                  <div className="pet-info-item">
                    <p className="pet-info-label">Age</p>
                    <p className="pet-info-value">12</p>
                  </div>
                </div>
              )}
              <button className="delete-btn" onClick={handleDelete}>
                Delete Pet
              </button>
            </div>
          </div>

          {/* Form Section */}
          <div className="form-section">
            <h2 className="form-title">Information</h2>

            <div className="form-group">
              <label htmlFor="name" className="edit-pet-form-label">
                Pet Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="species" className="edit-pet-form-label">
                Species
              </label>
              <select
                id="species"
                name="species"
                value={formData.species}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">Select species</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="breed" className="edit-pet-form-label">
                Breed
              </label>
              <select
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
                className="form-input"
                disabled={!formData.species}
              >
                <option value="">Select breed</option>
                {breedOptions.map((breed) => (
                  <option key={breed.value} value={breed.value}>
                    {breed.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="gender" className="edit-pet-form-label">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="weight" className="edit-pet-form-label">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="form-input"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="date_of_birth" className="edit-pet-form-label">
                Date of Birth
              </label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="edit-pet-form-label">
                <input
                  type="checkbox"
                  name="desexed"
                  checked={formData.desexed}
                  onChange={handleInputChange}
                  className="form-checkbox-btn"
                />
                <span>Desexed</span>
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="notes" className="edit-pet-form-label">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="form-textarea"
                rows="4"
              />
            </div>
            
            <div className="form-actions-button">
              <div className="form-actions">
                <button className="edit-btn-cancel" onClick={handleCancel}>
                  Cancel
                </button>
              </div>

              <button className="btn-save" onClick={handleSave}>
                  Save Pet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
