import React, { useState, useEffect } from "react";
import SearchBar from "../../components/SearchBar/SearchButton.jsx";
import Card from "./Card.jsx";
import card_Data from "./card_Data.js";
import CardBanner from "./CardBanner.jsx";
import banner_Data from "./banner_Data.js";
import Advert from "./Advert.jsx";
import advert_Data from "./advert_Data.js";
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
function advertBanner(props) {
  return (
    <Advert
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
  // 1. Add state for the live providers
  const [topProviders, setTopProviders] = useState([]);

  // 2. Fetch the same public endpoint
  useEffect(() => {
    const fetchTopProviders = async () => {
      try {
        const response = await fetch("/api/providers/top-rated");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setTopProviders(data.providers);
      } catch (error) {
        console.error("Error fetching providers:", error);
      }
    };
    fetchTopProviders();
  }, []);

  return (
    <div className="home-container">
      {/* Main Heading */}
      <h1 className="home-heading">
          Book your next healthcare <br /> visit in just a few clicks
      </h1>

      {/* Subheading */}
      <p className="home-subheading">
        Everything your pet needs, all in one platform
      </p>

      <SearchBar />

      {/* DYNAMIC BACKEND SECTION: Top Rated Providers */}
      <div className="topsearchs-title-card-container" style={{ marginTop: '40px' }}>
        <p className="topsearchs-card-title">Top Rated Providers</p>
      </div>
      
      <div className="topsearchs-cards-container">
        {topProviders.length > 0 ? (
          topProviders.map((provider) => (
            <Card
              key={provider.id}
              img={provider.img_url}
              title={`${provider.name} (⭐${provider.rating})`}
            />
          ))
        ) : (
          <p>Loading top rated clinics...</p>
        )}
      </div>

      {/* Faster Booking Banner Section */}
      <div className="home-banner-container">
        {banner_Data.map(bannerCard)}
      </div>

      {/* Advert card */}
      <div className="banner-advert-container">
        {advert_Data.map(advertBanner)}
      </div>


    </div>
  );
}


export default Home;