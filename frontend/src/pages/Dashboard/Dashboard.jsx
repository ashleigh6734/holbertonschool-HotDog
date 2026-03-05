import './Dashboard.css';

import DashboardHero from '../../components/Dashboard/DashboardHero.jsx';
// import DashboardSearch from '../../components/Dashboard/DashboardSearch.jsx';
import SearchBar from '../../components/SearchBar/SearchButton.jsx';
import TopServicesAndEvents from '../../components/Dashboard/TopServicesAndEvents.jsx';
import DashboardBanner from '../../components/Dashboard/DashboardBanner.jsx';
import PetStylistReviews from '../../components/Dashboard/PetStylistReviews.jsx';
import Advert from '../../pages/Home/Advert.jsx';
import advert_Data from '../../pages/Home/advert_Data.js';

// import { STYLISTS } from './dashboardData.js';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [topProviders, setTopProviders] = useState([]);

  useEffect(() => {
    const fetchTopProviders = async () => {
      try {
        const response = await fetch('/api/providers/top-rated');
        if (response.ok) {
          const data = await response.json();
          console.log('1. Raw data from backend:', data);
          const extractedArray = Array.isArray(data) ? data : data.providers;
          console.log('2. Array passed to React state:', extractedArray);
          setTopProviders(extractedArray || []);
        }
      } catch (error) {
        console.error('Failed to fetch top providers:', error);
      }
    };

    fetchTopProviders();
  }, []);

  return (
    <div className="dash">
      <div className="dash-container">
        
        <DashboardHero
          displayGreeting={false}
          title="Welcome to HotDog, where quality care and everything your pet needs come together."
        />

        {/* <DashboardSearch
          onSearch={(query) => {
            console.log('search:', query);
          }}
        /> */}
        <SearchBar />

        <TopServicesAndEvents
          topProviders={topProviders}
        />

        <DashboardBanner
          title="Tick season!"
          text="Get your furry friend the care they need!"
          ctaText="Find a Provider"
        />
      </div>

      {/* <PetStylistReviews
        stylists={STYLISTS}
        onBookClick={() => console.log('Book appointment')}
      /> */}
      <div className="banner-advert-container">
        {advert_Data
        .filter(ad => ad.id === 1 || ad.id === 2 || ad.dashboardSubtitle)
        .map(advert =>(
          <Advert
            key={advert.id}
            img={advert.img}
            name={advert.name}
            description={advert.description}
            dashboardSubtitle={advert.dashboardSubtitle}
          />
        ))}
      </div>

    </div>
  );
}
