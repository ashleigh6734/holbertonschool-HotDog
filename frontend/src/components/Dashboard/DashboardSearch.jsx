import { useState } from "react";

export default function DashboardSearch({ onSearch }) {
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSearch?.({ service, location });
  }

  return (
    <section className="search">
      <form className="search-box" onSubmit={handleSubmit}>
        <input
          className="search-input"
          placeholder="Service, practice..."
          value={service}
          onChange={(e) => setService(e.target.value)}
        />
        <div className="search-divider" />
        <input
          className="search-input"
          placeholder="Postcode or suburb"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button className="search-btn" type="submit" aria-label="Search">
          🔍
        </button>
      </form>
    </section>
  );
}