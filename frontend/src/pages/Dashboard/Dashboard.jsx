import "./Dashboard.css";

import DashboardHero from "../../components/Dashboard/DashboardHero";
import DashboardSearch from "../../components/Dashboard/DashboardSearch";
import TopServicesAndEvents from "../../components/Dashboard/TopServicesAndEvents";
import DashboardBanner from "../../components/Dashboard/DashboardBanner";
import PetStylistReviews from "../../components/Dashboard/PetStylistReviews";

import {
  TOP_SERVICES,
  UPCOMING_EVENTS,
  STYLISTS,
} from "./dashboardData";

export default function Dashboard() {
  return (
    <div className="dash">
      <div className="dash-container">
        <DashboardHero name="Annie" />

        <DashboardSearch
          onSearch={(query) => {
            // MVP: 先打印，后面你们接 API 或 route
            console.log("search:", query);
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
          onCtaClick={() => console.log("CTA clicked")}
        />
      </div>

      <PetStylistReviews
        stylists={STYLISTS}
        onBookClick={() => console.log("Book appointment")}
      />
    </div>
  );
}
