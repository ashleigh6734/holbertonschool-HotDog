import "../../PetProfile/AllPets.css";
import PetCard from "../../../components/cards/PetCard";
import { useEffect, useState } from "react";
import { getMyPets } from "../../../api/pet";
import ProviderNav from "../../../components/Header/ProviderNav.jsx";
import "../../../components/Header/providernavStyles.css";

export default function PatientList() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found");
      return;
    }

    getMyPets(token)
      .then(data => {
        console.log("Fetched pets:", data);
        setPets(data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="all-pets-container">
      <div className="all-pets-content">
        <div className="all-pets-header">
          <h2>Your Pet(s)</h2>
        </div>
        <div className="all-pets-actions">
          <div>All({pets.length})</div>
          <button className="btn-yellow">+ Add Pet(s)</button>
        </div>

        {pets.map(pet => (
          <PetCard key={pet.id} pet={pet} />
        ))}

      </div>
    </div>
  );
}
