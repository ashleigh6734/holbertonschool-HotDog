export default function DashboardBanner({ title, text, ctaText, onCtaClick }) {
  return (
    <section className="banner">
      <div className="banner-content">
        <h2 className="banner-title">{title}</h2>
        <p className="banner-text">{text}</p>
        <button className="banner-btn" type="button" onClick={onCtaClick}>
          {ctaText}
        </button>
      </div>

      <div className="banner-visual" aria-hidden="true">
        <div className="banner-circle" />
      </div>
    </section>
  );
}