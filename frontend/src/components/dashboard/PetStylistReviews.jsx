import Stars from "./Stars";

export default function PetStylistReviews({ stylists = [], onBookClick }) {
  return (
    <section className="stylists">
      <div className="dash-container">
        <h2 className="stylists-title">Pet Stylist</h2>

        <div className="stylist-grid">
          {stylists.map((p) => (
            <div key={p.id} className="stylist-card">
              <div className="stylist-avatar" />
              <h3 className="stylist-name">{p.name}</h3>
              <p className="stylist-blurb">{p.blurb}</p>
              <Stars value={p.rating} />
            </div>
          ))}
        </div>

        <div className="pager" aria-label="carousel pagination">
          <span className="dot dot-active" />
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>

        <div className="cta-row">
          <button className="primary-btn" type="button" onClick={onBookClick}>
            Book appointment
          </button>
        </div>
      </div>
    </section>
  );
}