import React from "react";

function Card(props) {
  return (
    <div
      className="topsearchs-card"
      style={{
        backgroundImage: `url(${props.img})`,
      }}
    >
      <div className="topsearchs-overlay">
        <p className="topsearchs-servicestitle ">{props.title}</p>
      </div>
    </div>
  );
}

export default Card;
