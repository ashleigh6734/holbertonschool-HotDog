import React, { useState } from 'react';
import Days from "../../assets/icons/calendar-icon.png";
import Time from "../../assets/icons/clockicon.png";
import Locationicon from "../../assets/icons/location.png";

function ServicesFilters_Card(props) {
  return (
    <div className="service-card">

      {/* Top section */}
      <div className="service-info-row">
        {props.img && (
          <img src={props.img} className="company-logos" />
        )} 

        <div className="service-header-text">
          <p className="service-name">{props.title}</p>
          <div className="location-container">
            <div className="address-and-icon">
              <img src={Locationicon} width="20" />
            </div>

            <div className="address-and-icon">
              <p className="service-address">{props.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Opening hours*/}
      <div className="service-info-row middle-row">
        <div className="AvgRating">
          <p className="label">Avg rating</p>
          <p className="rating">{props.avgrating}</p>
        </div>
          
        <div className="service-header-text"> 
          <p className={`opening-container ${props.isOpen ? "open" : "closed"}`}>
            ● {props.isOpen ? "Open" : "Closed"}
          </p>
          <div className="opening-hours">
            <div className="hours-items">
              <img src={Days} width="20" />
              <img src={Time} width="20" />
            </div>

            <div className="hours-items">
              <p className="service-days">{props.days}</p>
              <p className="service-times">{props.times}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="service-overlay">
        <div className="availability-container">
          <span className="today">Today</span>
          {props.availability.split(" ").map((time) => (
            <span key={time} className="times">{time}</span>
          ))}
        </div>

        {props.booknowbtn && (
          <button className="book-now-btn">Book Now</button>
        )}
      </div>

    </div>
  );
}

export default ServicesFilters_Card;
