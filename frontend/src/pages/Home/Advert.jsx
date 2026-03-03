import React from "react";
import Avatar from "../../components/AvatarImages/AvatarImages.jsx";

function Advert(props) {
  return (
    <div className="advert-banner-card">
      {/* Profile */}
      {props.img && <Avatar img={props.img} />}
      
      {/* Name + Description */}
      {props.name && props.description && (
        <>
          <p className="advert-name">{props.name}</p>
          <p className="advert-description">{props.description}</p>
        </>
      )}

      {/* Home banner: title + subtitle */}
      {props.title && props.subtitle && (
        <>
          <h1 className="advert-h1">{props.title}</h1>
          <p className="advert-subtitle">{props.subtitle}</p>
          {props.showButton && (
            <button 
              className="advert-btn"
              onClick={props.registerNowBtnClick}
            >
              Register With Us Now!
            </button>
          )}
        </>
      )}

      {/* Dashboard-only banner */}
      {props.dashboardSubtitle && !props.subtitle && (
        <p className="dashboard-subtitle">{props.dashboardSubtitle}</p>
      )}
    </div>
  );
}

export default Advert;