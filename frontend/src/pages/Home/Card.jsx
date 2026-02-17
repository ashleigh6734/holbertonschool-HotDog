import React from "react";

function Card(props) {
  return (
    <div
      className="card"
      style={{
        backgroundImage: `url(${props.img})`,
      }}
    >
      <div className="overlay">
        <p className="title">{props.title}</p>
      </div>
    </div>
  );
}

export default Card;
