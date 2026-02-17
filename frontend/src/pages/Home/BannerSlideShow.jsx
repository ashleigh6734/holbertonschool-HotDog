import React from "react";
import Avatar from "../../components/AvatarImages/AvatarImages.jsx";

function BannerSlideShow(props) {
  return (
    <div className="bannershow-card">
      {/* Profile */}
      {props.img && <Avatar img={props.img} />}
      {/* Banner slide show */}
      {props.name && props.description && (
        <>
          <p className="banner-name">{props.name}</p>
          <p className="banner-description">{props.description}</p>
        </>
      )}

      {/* banner Heading */}
      {props.title && props.subtitle && (
        <>
          <h1 className="bannershow-h1">{props.title}</h1>
          <p className="banner-subtitle">{props.subtitle}</p>

          {props.showButton && (
          <button className="allthingspetsbanner-btn">Book Us Now!</button>
          )}
        </>
      )}
      
    </div>
  
  );
}


export default BannerSlideShow;

