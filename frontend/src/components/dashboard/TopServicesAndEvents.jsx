import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import desexingImg from '../../assets/images/desexing.jpg';
import dentalImg from '../../assets/images/dental-care.jpg';
import specialistImg from '../../assets/images/specialist-services.jpg';
import nailsImg from '../../assets/images/nail-trimming.jpg';
import hairImg from '../../assets/images/haircuts.jpg';
import trainingImg from '../../assets/images/puppy-training.jpg';

const SERVICE_IMAGES = {
  surgery: desexingImg,
  dental: dentalImg,
  specialist: specialistImg,
  nails: nailsImg,
  hair: hairImg,
  training: trainingImg,
};

export default function TopServicesAndEvents({
  topServices = [],
  upcomingEvents = [],
}) {
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming
  const navigate = useNavigate();

  return (
    <section className="grid-2col">
      <div className="panel">
        <h2 className="panel-title">Your top used services</h2>

        <div className="service-grid">
          {topServices.map((service) => (
            <div key={service.id} className="service-card">
              <img
                className="service-img"
                src={SERVICE_IMAGES[service.id]}
                alt={service.title}
                loading="lazy"
              />
              <div className="service-label">{service.title}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel events">
        <div className="events-tabs">
          <button
            className="tab"
            type="button"
            onClick={() => navigate('/appointments')}
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
