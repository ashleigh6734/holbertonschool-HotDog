import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import ConfirmModalCustom from '../../../components/modals/ConfirmModalCustom';
import { getProviderAppointments, cancelAppointment } from '../../../api/providerBookings';
import './ManageAppointmentProvider.css';
import LocationIcon from '../../../assets/icons/geo-alt.svg';

export default function ManageAppointmentProvider() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  // Fetch provider bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const data = await getProviderAppointments(token);
        // Filter out cancelled bookings
        const activeBookings = (data.appointments || []).filter(
          (apt) => apt.status !== 'CANCELLED'
        );
        setBookings(activeBookings);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchBookings();
    }
  }, [user]);

  // Handle cancel button click
  const handleCancelClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowCancelConfirm(true);
  };

  // Handle confirm cancel
  const handleConfirmCancel = async () => {
    if (!selectedBookingId) return;

    try {
      setCancellingId(selectedBookingId);
      const token = localStorage.getItem('token');
      await cancelAppointment(token, selectedBookingId);

      // Remove cancelled booking from list
      setBookings((prev) =>
        prev.filter((booking) => booking.id !== selectedBookingId)
      );

      setShowCancelConfirm(false);
      setShowCancelSuccess(true);

      // Close success modal after 2 seconds
      setTimeout(() => {
        setShowCancelSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.message);
      console.error('Error cancelling booking:', err);
      setShowCancelConfirm(false);
    } finally {
      setCancellingId(null);
      setSelectedBookingId(null);
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
    <div className="manage-appointment-provider">
      <div className="manage-appointment-provider-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          &lt;
        </button>
        <h1>Manage Appointments</h1>
      </div>

      {loading && <p className="loading">Loading bookings...</p>}
      {error && <p className="error">Error: {error}</p>}

      {!loading && bookings.length === 0 && (
        <p className="no-bookings">You have no upcoming bookings.</p>
      )}

      <div className="bookings-list">
        {bookings.map((booking) => (
          <div key={booking.id} className="booking-card">
            <div className="booking-details">
              {/* Provider Name */}
              <div className="detail-row">
                <div className="detail-label">
                  <span className="icon">🩺</span>
                  <span>Provider:</span>
                </div>
                <span className="detail-value">
                  {booking.provider_name}
                </span>
              </div>

              {/* Booking Date and Time */}
              <div className="detail-row">
                <div className="detail-label">
                  <span className="icon">📅</span>
                  <span>Time:</span>
                </div>
                <span className="detail-value">
                  {formatDate(booking.date_time)} {formatTime(booking.date_time)}
                </span>
              </div>

              {/* Location */}
              <div className="detail-row">
                <div className="detail-label">
                  <img src={LocationIcon} alt="location" className="location-icon" />
                  <span>Location</span>
                </div>
                <span className="detail-value">
                  {booking.provider_address}
                </span>
              </div>
            </div>

            {/* Cancel Button */}
            <button
              className="cancel-btn"
              onClick={() => handleCancelClick(booking.id)}
              disabled={cancellingId === booking.id}
            >
              {cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
            </button>
          </div>
        ))}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <ConfirmModalCustom
          title="Are you sure you want to cancel this booking?"
          onConfirm={handleConfirmCancel}
          onClose={() => {
            setShowCancelConfirm(false);
            setSelectedBookingId(null);
          }}
          confirmText="Confirm"
          isLoading={cancellingId !== null}
        />
      )}

      {/* Cancel Success Modal */}
      {showCancelSuccess && (
        <div className="success-modal">
          <div className="success-modal-content">
            <h2>Booking Cancelled</h2>
            <p>This booking has been successfully cancelled.</p>
          </div>
        </div>
      )}
    </div>
  );
}
