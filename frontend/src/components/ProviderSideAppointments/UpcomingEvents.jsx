import { useState } from "react";
import "./UpcomingEvents.css";

export default function UpcomingEvents({ upcomingEvents = [] }) {
  const [activeTab, setActiveTab] = useState("upcoming"); // upcoming

  return (
    <section>
      <div className="panel events">
        <div>
          <div
            className={`tab ${activeTab === "upcoming" ? "tab-active" : ""}`}
            type="button"
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming appointments
          </div>
        </div>

        <div className="events-list">
          {(activeTab === "upcoming" ? upcomingEvents : []).map((e, idx) => (
            <div key={idx} className="events-row">
              <div className="event-date">{e.date}</div>
              <div className="event-title">{e.time}</div>
              <div className="event-title">{e.service_type}</div>
              <div className="event-title">{e.pet_name}</div>
              <div className="event-title">{e.status}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
