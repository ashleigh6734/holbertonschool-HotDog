import './Dashboard.css';

import DashboardHero from '../../components/Dashboard/DashboardHero.jsx';
import DashboardSearch from '../../components/Dashboard/DashboardSearch.jsx';
import TopServicesAndEvents from '../../components/Dashboard/TopServicesAndEvents.jsx';
import DashboardBanner from '../../components/Dashboard/DashboardBanner.jsx';
import PetStylistReviews from '../../components/Dashboard/PetStylistReviews.jsx';

import { TOP_SERVICES, UPCOMING_EVENTS, STYLISTS } from './dashboardData.js';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="dash">
      <div className="dash-container">
        <DashboardHero name={user?.first_name || "User"} />

        <DashboardSearch
          onSearch={(query) => {
            console.log('search:', query);
          }}
        />

        <TopServicesAndEvents
          topServices={TOP_SERVICES}
          upcomingEvents={UPCOMING_EVENTS}
        />

        <DashboardBanner
          title="Tick season!"
          text="Get your furry friend the care they need with All Pets Health"
          ctaText="Book appointment"
        />
      </div>

      <PetStylistReviews
        stylists={STYLISTS}
        onBookClick={() => console.log('Book appointment')}
      />
    </div>
  );
}
