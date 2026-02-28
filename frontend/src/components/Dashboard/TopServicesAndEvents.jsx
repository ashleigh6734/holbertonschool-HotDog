import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function TopServicesAndEvents({
  topProviders = [], // Accepting live backend data
  upcomingEvents = [],
}) {
  const [activeTab, setActiveTab] = useState('upcoming');
  const navigate = useNavigate();
  console.log("3. Data received by Grid Component:", topProviders);

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
            className={`tab ${activeTab === 'upcoming' ? 'tab-active' : ''}`}
            type="button"
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming events
          </button>
        </div>

        <div className="events-list">
          {(activeTab === 'upcoming' ? upcomingEvents : []).map((e, idx) => (
            <div key={idx} className="event-row">
              <div className="event-date">{e.date}</div>
              <div className="event-title">{e.title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
