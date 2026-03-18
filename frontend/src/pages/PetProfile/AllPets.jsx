import "./AllPets.css";
import PetCard from "../../components/cards/PetCard";
import { useEffect, useState } from "react";
import { getMyPets } from "../../api/pet";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import FormAddPet from "../../components/AddPetsForm/FormAddPet.jsx";

export default function AllPets() {
  const [pets, setPets] = useState([]);

  const refreshPets = () => {
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
  };

  // Load pets on page mount
  useEffect(() => {
    refreshPets();
  }, []);

  return (
    <div className="pets-container">
      <div className="pets-section">
        <div className="all-pets-content">
          <div className="all-pets-header">
            <h2>Your Pet(s)</h2>
          </div>
          <div className="all-pets-actions">
            <div>All({pets.length})</div>
              {/* <div class="popup-content"> */}
                <Popup
                  trigger={<button className="btn-yellow">+ Add Pet(s)</button>}
                  modal
                  closeOnDocumentClick
                  overlayStyle={{
                    background: "rgba(31, 58, 95, 0.35)",
                    zIndex: 1200,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    paddingTop: "120px",
                  }}
                  contentStyle={{ 
                    padding: 0,
                    border: "none",
                    background: "transparent",
                    boxShadow: "none",
                    width: "min(92vw, 540px)",
                    margin: 0,
                  }}
                >
                  {(close) => (
                    <div>
                      <FormAddPet 
                      closePopup={close} 
                      onPetAdded={refreshPets}
                      />
                    </div>
                  )}
                </Popup>
              {/* </div> */}
          </div>

          <div className="pets-list">
            {pets.map(pet => (
              <PetCard key={pet.id} pet={pet} onPetDeleted={refreshPets} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
