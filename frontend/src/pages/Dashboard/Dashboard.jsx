import './Dashboard.css';

import DashboardHero from '../../components/Dashboard/DashboardHero.jsx';
import TopServicesAndEvents from '../../components/Dashboard/TopServicesAndEvents.jsx';
import DashboardBanner from '../../components/Dashboard/DashboardBanner.jsx';
import PetStylistReviews from '../../components/Dashboard/PetStylistReviews.jsx';
import SearchBar from '../../components/SearchBar/SearchButton.jsx';

import { STYLISTS } from './dashboardData.js';
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
        <DashboardHero name={user?.first_name || 'User'} />

        <SearchBar />

        <TopServicesAndEvents
          topProviders={topProviders}
        />

        <DashboardBanner
          title="Tick season!"
          text="Get your furry friend the care they need with All Pets Health"
          ctaText="Book appointment"
        />
      </div>

      <PetStylistReviews stylists={STYLISTS} />
    </div>
  );
}
