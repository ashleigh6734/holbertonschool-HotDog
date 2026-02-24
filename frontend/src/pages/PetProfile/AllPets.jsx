import "./AllPets.css";
import PetCard from "../../components/cards/PetCard";
import { useEffect, useState } from "react";
import { getMyPets } from "../../api/pet";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import FormAddPet from "../../components/AddPetsForm/FormAddPet.jsx";

export default function AllPets() {
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
          <Popup
            trigger={<button className="btn-yellow">+ Add Pet(s)</button>}
            position="bottom center" 
            closeOnDocumentClick
            nested
            arrow={false}  
            overlayStyle={{ background: "none" }}
            contentStyle={{ padding: 0, border: "none", background: "none" }}
          >
            {(close) => (
              <div>
                <FormAddPet closePopup={close} />
              </div>
            )}
          </Popup>
        </div>

        <div className="pets-list">
          {pets.map(pet => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>

      </div>
    </div>
  );
}
