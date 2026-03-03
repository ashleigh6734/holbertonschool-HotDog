import React from "react";

function Card(props) {
  return (
    <div
      className="topsearchs-card"
      onClick={props.onClick}
      style={{
        backgroundImage: `url(${props.img})`,
        cursor: "pointer",
      }}
    >
      <div className="topsearchs-overlay">
        <p className="topsearchs-servicestitle ">{props.title}</p>
      </div>
    </div>
  );
}

export default Card;
