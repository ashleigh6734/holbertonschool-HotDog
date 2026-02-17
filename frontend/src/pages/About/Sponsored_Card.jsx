import React from "react";

function Sponsored_Card(props) {
  return (
    <div className="sponsor-card">
      {/* icons */}
      {props.img && (
        <img src={props.img} className="icon-sponsor" />
      )}

      {/* description */}
      {props.description && (
        <p className="sponsor-description">{props.description}</p>
      )}
      
    </div>
  
  );
}


export default Sponsored_Card;

