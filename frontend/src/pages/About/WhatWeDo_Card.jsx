import React from "react";
import AvatarImages from "../../components/AvatarImages/AvatarImages.jsx";

function WhatWeDo_Card(props) {
  return (
    <div className="adout-bannershow-card">
      {/* icons */}
      {props.img && (
        <img src={props.img} className="icon-whatwedo" />
      )}

      {/* Banner slide show */}
      {props.title && props.description && (
        <>
          <p className="adout-banner-title">{props.title}</p>
          <p className="adout-banner-description">{props.description}</p>
        </>
      )}
      
    </div>
  
  );
}


export default WhatWeDo_Card;

