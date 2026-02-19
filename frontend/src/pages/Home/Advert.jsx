import React from "react";
import Avatar from "../../components/AvatarImages/AvatarImages.jsx";

function Advert(props) {
  return (
    <div className="advert-banner-card">
      {/* Profile */}
      {props.img && <Avatar img={props.img} />}
      {/* Banner slide show */}
      {props.name && props.description && (
        <>
          <p className="advert-name">{props.name}</p>
          <p className="advert-description">{props.description}</p>
        </>
      )}

      {/* banner Heading */}
      {props.title && props.subtitle && (
        <>
          <h1 className="advert-h1">{props.title}</h1>
          <p className="advert-subtitle">{props.subtitle}</p>

          {props.showButton && (
          <button className="advert-btn">Book Us Now!</button>
          )}
        </>
      )}
      
    </div>
  
  );
}


export default Advert;

