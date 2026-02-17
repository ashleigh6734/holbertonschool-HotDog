import React, { useState } from 'react';


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
          <p className="service-address">{props.address}</p>
        </div>
      </div>

      {/* Opening hours*/}
      <div className="service-info-row">
        <div className="service-header-text">
          <p className="label">Avg rating</p>
          <p className="rating">{props.avgrating}</p>
        </div>
          
        <div className="service-header-text"> 
          <p className="opening-container">
            ● Opening hours
          </p>
          <p className="service-name">{props.days}</p>
          <p className="service-address">{props.times}</p>
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
