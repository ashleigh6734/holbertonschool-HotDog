import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function ProviderPetProfile() {
  const navigate = useNavigate();
  const [pets] = useState([
    {
      id: 1,
      name: 'Miss Poodle',
      species: 'cat',
      breed: 'Siamese',
      dob: '1995-09-12',
    },
  ]);

  const handleEdit = (petId) => {
    navigate(`/edit-pet/${petId}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Pet Profile page - to be developed later */}
    </div>
  );
}
