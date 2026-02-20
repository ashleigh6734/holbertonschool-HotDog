import React from "react";

function ChooseUs_Card(props) {
  return (
    <div className="sponsor-card">
      {/* description */}
      {props.description && (
        <p className="adout-body-text">{props.description}</p>
      )}
      
    </div>
  
  );
}


export default ChooseUs_Card;

