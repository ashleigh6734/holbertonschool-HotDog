import React from "react";
import AvatarImages from "../../components/AvatarImages/AvatarImages.jsx";

function PracticeTestimonials_Card(props) {
  return (
    <div className="adout-bannershow-card">
      {/* profiles */}
      {props.img && (
        <img src={props.img} className="icon-businesstesi" />
      )}

      {/* Banner slide show */}
      {props.name && props.companyName && props.description && (
        <>
          <p className="adout-banner-title">{props.name}</p>
          <p className="adout-banner-companyName ">{props.companyName}</p>
          <p className="adout-banner-description">{props.description}</p>
        </>
      )}
      
    </div>
  
  );
}


export default PracticeTestimonials_Card;

