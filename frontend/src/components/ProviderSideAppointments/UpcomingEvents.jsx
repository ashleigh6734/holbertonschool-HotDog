import "./UpcomingEvents.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

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
          {upcomingEvents.map((e) => (
            <div key={e.id} className="events-row">
              <div className="appt-date">
                {e.date_time ? dayjs.utc(e.date_time).format("DD/MM/YY") : "-"}
              </div>
              <div className="appt-title">
                {e.date_time ? dayjs.utc(e.date_time).format("HH:mm") : "-"}
              </div>
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
