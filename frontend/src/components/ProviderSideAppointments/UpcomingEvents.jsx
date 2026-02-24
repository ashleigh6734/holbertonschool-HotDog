import "./UpcomingEvents.css";

export default function UpcomingEvents({ upcomingEvents = [] }) {
  return (
    <section>
      <div className="panel events">
        <div className="upcoming-appointments-banner">
          {/* <div
            className={`tab ${activeTab === "upcoming" ? "tab-active" : ""}`}
            type="button"
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming appointments
          </div> */}
          <p>Upcoming Appointments</p>
        </div>

        <div className="events-list">
          {upcomingEvents.map((e, idx) => (
            <div key={idx} className="events-row">
              <div className="appt-date">{e.date}</div>
              <div className="appt-title">{e.time}</div>
              <div className="appt-title">{e.service_type}</div>
              <div className="appt-title">{e.pet_name}</div>
              <div className="appt-title">{e.status}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
