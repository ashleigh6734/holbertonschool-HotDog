import './UpcomingEvents.css';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useNavigate } from 'react-router-dom';

dayjs.extend(utc);

export default function UpcomingEvents({ upcomingEvents = [] }) {
  const navigate = useNavigate();
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
                {e.date_time ? dayjs.utc(e.date_time).format('DD/MM/YY') : '-'}
              </div>
              <div className="appt-title">
                {e.date_time ? dayjs.utc(e.date_time).format('HH:mm') : '-'}
              </div>
              <div className="appt-title">
                {e.service_type}
                <span
                  className="edit-icon"
                  onClick={() =>
                    navigate('/provider/manage-appointments', {
                      state: { appointment: e },
                    })
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    >
                      <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1" />
                      <path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3l8.385-8.415zM16 5l3 3" />
                    </g>
                  </svg>
                </span>
              </div>

              <div className="appt-title">{e.pet_name}</div>
              <div className="appt-title">{e.status}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
