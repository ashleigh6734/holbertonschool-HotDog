import React from "react";

function Card({ img, title, onClick }) {
  return (
    <div
      className="topsearchs-card"
      onClick={onClick}
      style={{
        backgroundImage: `url(${img})`,
        cursor: "pointer",
      }}
    >
      <div className="topsearchs-overlay">
        <p className="topsearchs-servicestitle">{title}</p>
      </div>
    </div>
  );
}

export default Card;