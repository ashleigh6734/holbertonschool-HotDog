import Stars from "./Stars";
import { useNavigate } from "react-router-dom";

export default function PetStylistReviews({ stylists = [], onBookClick }) {
  const navigate = useNavigate();
  return (
    <section className="stylists">
      <div className="dash-container">
        <h2 className="stylists-title">Pet Stylist</h2>

        <div className="stylist-grid">
          {stylists.map((p) => (
            <div key={p.id} className="stylist-card">
              <img 
                className="stylist-avatar" 
                src={p.img} 
                alt={p.name}
              />
              <h3 className="stylist-name">{p.name}</h3>
              <p className="stylist-blurb">{p.blurb}</p>
              <Stars value={p.rating} />
            </div>
          ))}
        </div>

        <div className="cta-row">
          <button 
            className="primary-btn" 
            type="button" 
            onClick={() => {
              if (onBookClick) onBookClick();
              navigate("/services");
            }}
          >
            Book appointment
          </button>
        </div>
      </div>
    </section>
  );
}