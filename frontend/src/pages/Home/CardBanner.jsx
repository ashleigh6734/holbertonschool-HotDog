import React from "react";

function CardBanner(props) {
  return (
    <div className="banner-card">
      {/* heading*/}
      {props.bannerTitle && (
        <>
          <h1 className="banner-h1">{props.bannerTitle}</h1>
          {props.showButton && (
          <button className="banner-btn">Find a Practice Now!</button>
          )}
        </>
      )}

      {/* banner image */}
      {props.img && (
        <img
          src={props.img}
          alt="Banner"
          className="banner-img"
        />
      )}
    </div>
  );
}

export default CardBanner;