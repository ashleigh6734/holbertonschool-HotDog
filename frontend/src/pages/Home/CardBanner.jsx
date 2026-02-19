import React from "react";

function CardBanner(props) {
  return (
    <div className="home-banner-card">
      {/* heading*/}
      {props.bannerTitle && (
        <>
          <h1 className="home-banner-h1">{props.bannerTitle}</h1>
          {props.showButton && (
          <button className="home-banner-btn">Find a Practice Now!</button>
          )}
        </>
      )}

      {/* banner image */}
      {props.img && (
        <img
          src={props.img}
          alt="Banner"
          className="home-banner-img"
        />
      )}
    </div>
  );
}

export default CardBanner;