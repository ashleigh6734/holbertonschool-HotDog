import './Dashboard.css';

import DashboardHero from '../../components/Dashboard/DashboardHero';
import DashboardSearch from '../../components/Dashboard/DashboardSearch';
import TopServicesAndEvents from '../../components/Dashboard/TopServicesAndEvents';
import DashboardBanner from '../../components/Dashboard/DashboardBanner';
import PetStylistReviews from '../../components/Dashboard/PetStylistReviews';

import { TOP_SERVICES, UPCOMING_EVENTS, STYLISTS } from './dashboardData';
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
