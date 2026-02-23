import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ConfirmModalCustom from '../../components/modals/ConfirmModalCustom';
import './ManageAppointments.css';
import LocationIcon from '../../assets/icons/geo-alt.svg';

export default function ManageAppointments() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  // Fetch user appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/appointments/user/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch appointments: ${response.status}`);
        }

        const data = await response.json();
        setAppointments(data.appointments || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchAppointments();
    }
  }, [user]);

  // Handle cancel button click
  const handleCancelClick = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setShowCancelConfirm(true);
  };

  // Handle confirm cancel
  const handleConfirmCancel = async () => {
    if (!selectedAppointmentId) return;

    try {
      setCancellingId(selectedAppointmentId);
      const response = await fetch(
        `/api/appointments/${selectedAppointmentId}/cancel`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to cancel appointment: ${response.status}`);
      }

      // Remove cancelled appointment from list
      setAppointments((prev) =>
        prev.filter((apt) => apt.id !== selectedAppointmentId)
      );

      setShowCancelConfirm(false);
      setShowCancelSuccess(true);

      // Close success modal after 2 seconds
      setTimeout(() => {
        setShowCancelSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.message);
      console.error('Error cancelling appointment:', err);
      setShowCancelConfirm(false);
    } finally {
      setCancellingId(null);
      setSelectedAppointmentId(null);
    }
  };

  // Format date and time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="manage-appointments">
      <div className="manage-appointments-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          &lt;
        </button>
        <h1>Manage your appointment(s)</h1>
      </div>

      {loading && <p className="loading">Loading appointments...</p>}
      {error && <p className="error">Error: {error}</p>}

      {!loading && appointments.length === 0 && (
        <p className="no-appointments">You have no upcoming appointments.</p>
      )}

      <div className="appointments-list">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="appointment-card">
            <div className="appointment-details">
              {/* Provider */}
              <div className="detail-row">
                <div className="detail-label">
                  <span className="icon">🩺</span>
                  <span>Provider:</span>
                </div>
                <span className="detail-value">
                  {appointment.provider_name}
                </span>
              </div>
              {/* Customer */}
              <div className="detail-row">
                <div className="detail-label">
                  <span className="icon">🐾</span>
                  <span>Customer:</span>
                </div>
                <span className="detail-value">{appointment.pet_name}</span>
              </div>
              {/* Date & Time */}
              <div className="detail-row">
                <div className="detail-label">
                  <span className="icon">🗓️</span>
                  <span>Time:</span>
                </div>
                <span className="detail-value">
                  {formatDate(appointment.date_time)}{' '}
                  {formatTime(appointment.date_time)}
                </span>
              </div>

              <div className="detail-row">
                <div className="detail-label">
                  <img
                    src={LocationIcon}
                    alt="location"
                    className="location-icon"
                  />
                  <span>Location:</span>
                </div>
                <span className="detail-value">
                  {appointment.provider_address}
                </span>
              </div>
            </div>

            <button
              className="cancel-btn"
              onClick={() => handleCancelClick(appointment.id)}
              disabled={cancellingId === appointment.id}
            >
              {cancellingId === appointment.id ? 'Cancelling...' : 'Cancel'}
            </button>
          </div>
        ))}
      </div>

      {/* Make Another Appointment Button */}
      <div className="make-another-appointment-section">
        <button 
          className="make-appointment-btn"
          onClick={() => navigate('/services')}
        >
          Make Another Appointment
        </button>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <ConfirmModalCustom
          title="Are you sure you want to cancel this appointment?"
          onConfirm={handleConfirmCancel}
          onClose={() => {
            setShowCancelConfirm(false);
            setSelectedAppointmentId(null);
          }}
          confirmText="Confirm"
          isLoading={cancellingId !== null}
        />
      )}

      {/* Cancel Success Modal */}
      {showCancelSuccess && (
        <div className="success-modal">
          <div className="success-modal-content">
            <h2>✅ Appointment Cancelled</h2>
            <p>Your appointment has been successfully cancelled.</p>
          </div>
        </div>
      )}
    </div>
  );
}
