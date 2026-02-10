import "./AllPets.css";
import PetCard from "../../components/cards/PetCard";

export default function AllPets() {
  return (
    <div className="all-pets-container">
      <div className="all-pets-content">
        <div className="all-pets-header">
          <h2>Your Pet(s)</h2>
        </div>
        <div className="all-pets-actions">
          <div>All(3)</div>
          <button className="btn-yellow">+ Add Pet(s)</button>
        </div>
        <PetCard />
        <PetCard />
        <PetCard />
      </div>
    </div>
  );
}
