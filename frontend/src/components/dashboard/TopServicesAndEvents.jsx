import { useState } from "react";

export default function TopServicesAndEvents({ topServices = [], upcomingEvents = [] }) {
  const [activeTab, setActiveTab] = useState("upcoming"); // upcoming | more

  return (
    <section className="grid-2col">
      <div className="panel">
        <h2 className="panel-title">Your top used services</h2>

        <div className="service-grid">
          {topServices.map((s) => (
            <div key={s.id} className="service-card">
              <div className="service-img" />
              <div className="service-label">{s.title}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel events">
        <div className="events-tabs">
          <button
            className={`tab ${activeTab === "more" ? "tab-active" : ""}`}
            type="button"
            onClick={() => setActiveTab("more")}
          >
            More…
          </button>
          <button
            className={`tab ${activeTab === "upcoming" ? "tab-active" : ""}`}
            type="button"
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming events
          </button>
        </div>

        <div className="events-list">
          {(activeTab === "upcoming" ? upcomingEvents : []).map((e, idx) => (
            <div key={idx} className="event-row">
              <div className="event-date">{e.date}</div>
              <div className="event-title">{e.title}</div>
            </div>
          ))}

          {activeTab === "more" && (
            <div style={{ padding: 12, fontSize: 12 }}>
              Coming soon…
            </div>
          )}
        </div>
      </div>
    </section>
  );
}