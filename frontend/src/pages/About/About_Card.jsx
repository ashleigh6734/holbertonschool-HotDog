import React from "react";

function About_Card(props) {
  return (
    <div className="about-banner-card">
      {/* heading*/}
      {props.bannerTitle && props.description && (
        <>
          <h1 className="adout-banner-h1">{props.bannerTitle}</h1>
          <p className="about-subheading ">{props.description}</p>
          {props.showButton && (
          <button className="contact-us-to-register-btn">Contact Us to Register!</button>
          )}
        </>
      )}

      {/* banner image */}
      {props.img && (
        <img
          src={props.img}
          alt="Banner"
          className="adout-banner-img"
        />
      )}
    </div>
  );
}

export default About_Card;