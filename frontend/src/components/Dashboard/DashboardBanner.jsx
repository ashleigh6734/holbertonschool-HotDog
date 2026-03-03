import { useNavigate } from "react-router-dom";
import tickImg from "../../assets/images/tick-season.png";

export default function DashboardBanner({ title, text, ctaText, onCtaClick }) {
  const navigate = useNavigate();

  function handleCta() {
    if (onCtaClick) {
      onCtaClick();
    } else {
      navigate("/services");
    }
  }

  return (
    <section className="banner">
      <div className="banner-content">
        <h2 className="banner-title">{title}</h2>
        <p className="banner-text">{text}</p>
        <button className="banner-btn" type="button" onClick={handleCta}>
          {ctaText}
        </button>
      </div>

      <div className="banner-visual" aria-hidden="true">
        <img className="banner-image" src={tickImg} alt="Tick season" />
      </div>
    </section>
  );
}