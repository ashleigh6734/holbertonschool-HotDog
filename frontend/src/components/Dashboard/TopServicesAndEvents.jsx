import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export default function TopServicesAndEvents({
  topProviders = [], // Accepting live backend data
}) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(true);
  
  console.log("3. Data received by Grid Component:", topProviders);

  // Fetch user appointments from backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoadingAppts(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setLoadingAppts(false);
          return;
        }

        const response = await fetch('/api/appointments/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const data = await response.json();
        const formattedAppts = (data.appointments || []).map((appt) => ({
          date: appt.date_time ? dayjs.utc(appt.date_time).format('DD/MM') : '-',
          title: appt.pet_name,
          service_type: appt.service_type,
          provider_name: appt.provider_name,
        }));
        setAppointments(formattedAppts);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setAppointments([]);
      } finally {
        setLoadingAppts(false);
      }
    };

    if (user?.id) {
      fetchAppointments();
    }
  }, [user]);

  return (
    <section className="grid-2col">
      <div className="panel">
        {/* Updated Title */}
        <h2 className="panel-title">Top Rated Providers</h2>

        <div className="service-grid">
          {/* SAFETY CHECK: If we have data, map it. If not, show the text */}
          {topProviders && topProviders.length > 0 ? (
            topProviders.map((provider) => (
              <div key={provider.id} className="top-service-card">
                <img
                  className="service-img"
                  src={provider.img_url}
                  alt={provider.name}
                  loading="lazy"
                  style={{ objectFit: 'cover' }}
                />
                <div className="service-label" style={{ lineHeight: '1.2' }}>
                  {provider.name} <br/>
                  <span style={{ fontSize: '0.85em', color: '#ffce31' }}>⭐ {provider.rating}</span>
                </div>
              </div>
            ))
          ) : (
            <p style={{ padding: '20px', color: '#666', fontStyle: 'italic' }}>Loading clinics or no data found...</p>
          )}
        </div>
      </div>

      <div className="panel events">
        <div className="events-tabs">
          <button
            className="tab"
            type="button"
            onClick={() => navigate('/manage-appointments')}
          >
            More…
          </button>
          <button
            className="tab tab-active"
            type="button"
          >
            Upcoming events
          </button>
        </div>

        <div className="events-list">
          {loadingAppts ? (
            <p style={{ padding: '20px', color: '#666' }}>Loading appointments...</p>
          ) : appointments.length > 0 ? (
            appointments.map((e, idx) => (
              <div key={idx} className="event-row">
                <div className="event-date">{e.date}</div>
                <div className="event-title">{e.title}</div>
                <div className="event-service">{e.service_type}</div>
              </div>
            ))
          ) : (
            <p style={{ padding: '20px', color: '#666', fontStyle: 'italic' }}>No upcoming appointments</p>
          )}
        </div>
      </div>
    </section>
  );
}
