import React from "react";
import WhatWeDo_Card from "./WhatWeDo_Card.jsx";
import whatwedo_Data from "./whatwedo_Data.js";
import Sponsored_Card from "./Sponsored_Card.jsx";
import sponsored_Data from "./sponsored_Data.js";
import ChooseUs_Card from "./ChooseUs_Card.jsx";
import chooseUs_Card_Data from "./chooseUs_Card_Data.js";
import About_Card from "./About_Card.jsx";
import about_Data from "./about_Data.js";
import PracticeTestimonials_Card from "./PracticeTestimonials_Card.jsx";
import practicetestimonials_Data from "./practicetestimonials_Data.js";
import AvatarImages from "../../components/AvatarImages/AvatarImages.jsx";
import "./aboutStyle.css";
import "../../components/AvatarImages/avatarStyle.css";


// Function for main banner
function aboutCard(props) {
  return (
    <About_Card
    key={props.id}
    img={props.img}
    bannerTitle={props.bannerTitle}
    description={props.description}
    showButton={props.showButton}
    />
  );
}

// Function what to do
function slideShow(props) {
  return (
    <WhatWeDo_Card
    key={props.id}
    img={props.img}
    title={props.title}
    description={props.description}
    />
  );
}

// Function choose us
function chooseUsCard(props) {
  return (
    <ChooseUs_Card
    key={props.id}
    description={props.description}
    />
  );
}

// Function what to do
function sponsorCard(props) {
  return (
    <Sponsored_Card
    key={props.id}
    img={props.img}
    description={props.description}
    />
  );
}

// Function practice testimonials
function practiceTestimonalsCard(props) {
  return (
    <PracticeTestimonials_Card
    key={props.id}
    img={props.img}
    name={props.name}
    companyName={props.companyName}
    description={props.description}
    />
  );
}


function Home() {
  return (
    <div className="adout-container">
      {/* Banner Section */}
      <div className="about-banner-container">
        {about_Data.map(aboutCard)}
      </div>

      <div className="using-hotDog-container">
      {/* Main Heading */}
      <h1 className="adout-heading">
          Using HotDog to Deliver a <br /> Better Patient Experience
      </h1>

      {/* Subheading */}
      <p className="adout-body-text">
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper uscipitlobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse
      </p>
      </div>

      {/* Banner what we do */}
      <div className="whatwedo_parentcontainer"> 
        <h1 className="adout-heading">What we do for you</h1>
        <p className="whatwedo-subheading">HotDog makes it easier for patients to find, book, and return to your practice.</p>
        <div className="whatwedo-showcontainer">
          {whatwedo_Data.map(slideShow)}
        </div>
      </div>

      
      {/* Banner choose us */}
      <div className="using-hotDog-container">
        <h1 className="adout-heading">Are you a practice interested <br /> in our platform!</h1>
        <div className="adout-body-text">
          {chooseUs_Card_Data.map(chooseUsCard)}
        </div>
      </div>
      
      
      {/* Banner what we do */}
      <div className="businesstesi_parentcontainer"> 
        <h1 className="adout-heading">Testimonials of businesses we work with</h1>
        <div className="businesstesi-showcontainer">
          {practicetestimonials_Data.map(practiceTestimonalsCard)}
        </div>
      </div>

      {/* Banner sponsor */}
      <div className="sponsor-container">
        {sponsored_Data.map(sponsorCard)}
      </div>

    </div>
  );
}


export default Home;
