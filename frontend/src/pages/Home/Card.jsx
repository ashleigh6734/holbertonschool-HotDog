import React from "react";

function Card({ img, title, linktoApptPage }) {
  return (
    <div
      className="topsearchs-card"
      style={{
        backgroundImage: `url(${img})`,
        cursor: "pointer"
      }}
      onClick={linktoApptPage}
    >
      <div className="topsearchs-overlay">
        <p className="topsearchs-servicestitle">{title}</p>
      </div>
    </div>
  );
}

export default Card;

