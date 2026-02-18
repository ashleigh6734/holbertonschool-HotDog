import React from "react";
import SearchBar from "../../components/SearchBar/SearchButton.jsx";
import Card from "./Card.jsx";
import card_Data from "./card_Data.js";
import CardBanner from "./CardBanner.jsx";
import banner_Data from "./banner_Data.js";
import BannerSlideShow from "./BannerSlideShow.jsx";
import bannerSlideShow_Data from "./bannerSlideShow_Data.js";
import AvatarImages from "../../components/AvatarImages/AvatarImages.jsx";
import "./homeStyle.css";
import "../../components/SearchBar/searchbar.css";
import "../../components/AvatarImages/avatarStyle.css";

// Function service cards
function createCard(props) {
  return (
    <Card
      key={props.id}
      title={props.title}
      img={props.img}
    />
  );
}

// Function for main banner
function bannerCard(props) {
  return (
    <CardBanner
    key={props.id}
    bannerTitle={props.bannerTitle}
    img={props.img}
    showButton={props.showButton}
    />
  );
}

// Function slide show banners
function slideShow(props) {
  return (
    <BannerSlideShow
    key={props.id}
    img={props.img}
    name={props.name}
    description={props.description}
    title={props.title}
    subtitle={props.subtitle}
    showButton={props.showButton}
    />
  );
}


function Home() {
  return (
    <div className="container">
      {/* Main Heading */}
      <h1 className="heading">
          Book your next healthcare <br /> visit in just a few clicks
      </h1>

      {/* Subheading */}
      <p className="subheading">
        Everything your pet needs, all in one platform
      </p>

      <SearchBar />

      {/* Top Searches Title */}
      <div className="title-card-container">
        <p className="card-title">Top Searches</p>
      </div>

      {/* Card Grid */}
      <div className="cards-container">
        {card_Data.map(createCard)}
      </div>

      {/* Banner Section */}
      <div className="banner-container">
        {banner_Data.map(bannerCard)}
      </div>

      {/* Banner Slide Show */}
      <div className="banner-slide-showcontainer">
        {bannerSlideShow_Data.map(slideShow)}
      </div>


    </div>
  );
}


export default Home;