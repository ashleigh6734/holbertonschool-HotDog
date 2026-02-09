import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './editPetDetails.css';

export default function EditPetDetails() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    gender: '',
    desexed: false,
    date_of_birth: '',
    weight: '',
    notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Mock fetch for development - will replace with API call
    const mockPet = {
      id: petId || 1,
      name: 'Miss Poodle',
      species: 'cat',
      gender: 'female',
      desexed: true,
      date_of_birth: '2025-06-28',
      weight: 8,
      notes: '',
    };
    setPet(mockPet);
    setFormData(mockPet);
    setLoading(false);
  }, [petId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    // TODO: wire up API save
    console.log('Saving pet data:', formData);
    navigate(-1);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      // TODO: wire up API delete
      console.log('Deleting pet:', petId);
      navigate(-1);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) return <div className="edit-pet-loading">Loading...</div>;

  return (
    <div className="edit-pet-container">
      <div className="edit-pet-header">
        <h1 className="edit-pet-title">Edit {pet?.name || 'Pet'} Details</h1>
        <button className="back-btn" onClick={handleCancel}>
          &lt; Back
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="edit-pet-content">
        {/* Pet Card Section */}
        <div className="pet-card-section">
          <div className="pet-card">
            <img
              className="pet-avatar"
              src="/src/assets/images/pet-avatar.png"
              alt={`${pet?.name || 'Pet'} avatar`}
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
              Delete Pet Profile
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div className="form-section">
          <h2 className="form-title">Information</h2>

          <div className="form-group">
            <label htmlFor="name" className="form-label">
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
            <label htmlFor="species" className="form-label">
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
            <label htmlFor="gender" className="form-label">
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
            <label htmlFor="weight" className="form-label">
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
            <label htmlFor="date_of_birth" className="form-label">
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
            <label className="form-label">
              <input
                type="checkbox"
                name="desexed"
                checked={formData.desexed}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              <span>Desexed</span>
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="notes" className="form-label">
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

          <div className="form-actions">
            <button className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn-save" onClick={handleSave}>
              Save Pet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
