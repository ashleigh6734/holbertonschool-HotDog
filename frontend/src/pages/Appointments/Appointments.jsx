import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./Appointments.css";
import DateStep from "./DateStep";
import TimeStep from "./TimeStep";
import { ReviewList } from "../../components/Review";
import LocationIcon from "../../assets/icons/location.png";
import EmailIcon from "../../assets/icons/email_icon.png";
import PhoneIcon from "../../assets/icons/telephone-icon.png";

import BookingSteps1 from "../../components/BookingSteps/BookingSteps1";
import BookingSteps2 from "../../components/BookingSteps/BookingSteps2";
import BookingSteps3 from "../../components/BookingSteps/BookingSteps3";

dayjs.extend(utc);

const API_URL = import.meta.env.VITE_API_URL;

export default function Appointments({ previewMode = false, providerData = null }) {
  const providerID = useParams();
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(today); // store selected date
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(""); 
  const [provider, setProvider] = useState({});

  // Start with an empty array so we don't flash dummy data before the real data loads
  const [reviews, setReviews] = useState([]);
  const [hasAppointment, setHasAppointment] = useState(false);
  const [validAppointmentId, setValidAppointmentId] = useState("");

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  const location = useLocation();
  const preselectedTimeRaw = location.state?.preselectedTime || "";
  

  function formatTo12Hour(time24) {
    if (!time24) return "";
    const [hourStr, minute] = time24.split(":");
    let hour = Number(hourStr);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  }

  useEffect(() => {
    if (preselectedTimeRaw) {
      setSelectedTime(formatTo12Hour(preselectedTimeRaw));
    }
  }, [preselectedTimeRaw]);

  // popup handler functions
  const openPopup = () => {
    setStep(1);
    setIsPopupOpen(true);
    document.body.classList.add("modal-open");
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setStep(1);
    setBookingData({});
    document.body.classList.remove("modal-open");
    setIsSubmitting(false);
  };

  const goBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const buildDateTimeFromSlot = () => {
    const match = selectedTime.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (!match) {
      throw new Error("Invalid time slot format");
    }

    let hour = Number(match[1]);
    const minute = Number(match[2]);
    const meridiem = match[3].toUpperCase();

    if (meridiem === "PM" && hour !== 12) {
      hour += 12;
    }
    if (meridiem === "AM" && hour === 12) {
      hour = 0;
    }

    const dateStr = selectedDate.format("YYYY-MM-DD");
    const hh = String(hour).padStart(2, "0");
    const mm = String(minute).padStart(2, "0");
    return dayjs.utc(`${dateStr}T${hh}:${mm}:00Z`).toISOString();
  };

  // Move popup steps
  const handleNext = async (dataFromStep) => {
    const updatedBookingData = {
      ...bookingData,
      ...dataFromStep,
    };

    setBookingData(updatedBookingData);

    if (step === 2) {
      const success = await submitAppointment(updatedBookingData);

      if (!success) return;
    }

    setStep((prev) => prev + 1);
  };

  // Submit appointment to backend
  const submitAppointment = async (dataFromStep1) => {
    const token = localStorage.getItem("token");

    if (!dataFromStep1.pet_id || !dataFromStep1.booking_type || !selectedTime) {
      alert("Please make sure all required fields are selected.");
      return false;
    }

    setIsSubmitting(true);

    try {
      const fullDateTime = buildDateTimeFromSlot();

      const response = await fetch(`${API_URL}/api/appointments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          pet_id: dataFromStep1.pet_id,
          provider_id: providerID.id,
          service_type: dataFromStep1.booking_type,
          date_time: fullDateTime,
          // date: selectedDate.format("YYYY-MM-DD"),
          // time: selectedTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.msg || "Failed to create appointment",
        );
      }

      setBookingData((prev) => ({
        ...prev,
        appointment_id: data.booking.id,
      }));

      return true;

      // Store the appointment ID for Step 3 display
    } catch (err) {
      alert("Failed to create appointment: " + err.message);
      return false; // 👈 failed
    } finally {
      setIsSubmitting(false);
    }
  };

  // FETCH SERVICE PROVIDER DETAILS
  useEffect(() => {
    if (previewMode && providerData) {
      setProvider(providerData);
      return;
    }
    // 1. Explicitly extract the ID string
    const idString = providerID.id;
    if (!idString) return;

    const fetchProviderDetails = async () => {
      const providerUrl = `${API_URL}/api/providers/${idString}`;
      try {
        const response = await fetch(providerUrl);
        if (!response.ok) throw new Error(`Status: ${response.status}`);

        const result = await response.json();
        setProvider(result);

        // 2. Map the reviews only if they exist in the backend response
        if (result.reviews && result.reviews.length > 0) {
          const formattedReviews = result.reviews.map((r) => ({
            userName: r.user_name || "Anonymous", // Backend field
            review: r.comment || "", // Backend field
            rating: r.rating || 0,
          }));

          console.log("Successfully formatted reviews:", formattedReviews);
          setReviews(formattedReviews);
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
      }
    };
    fetchProviderDetails();
  }, [providerID.id]);

  // console.log(provider.img_url, "provider");

  // FETCH AVAILABLE TIME SLOTS (CONNECTED TO BACKEND)
  useEffect(() => {
    if (previewMode) return;

    const fetchAvailableTimes = async () => {
      const formattedDate = selectedDate.format("YYYY-MM-DD");

      try {
        const response = await fetch(
          `${API_URL}/api/providers/${providerID.id}/slots?date=${formattedDate}`,
        );

        if (!response.ok) throw new Error(`Failed to fetch time slots: ${response.status}`);

        const data = await response.json();

        const slots = Array.isArray(data.slots)
          ? data.slots
          : (data.available_slots || []).map((slot) => ({
              time: slot.time || slot,
              is_booked: slot.is_booked || false,
            }));

        setAvailableTimes(slots);

        // Only reset selectedTime if there is no preselected time
        if (!preselectedTimeRaw) setSelectedTime("");
      } catch (error) {
        console.error("Error fetching times:", error);
        setAvailableTimes([]);
      }
    };

    fetchAvailableTimes();
  }, [selectedDate, providerID.id, preselectedTimeRaw]);

  // 4. SUBMIT A NEW REVIEW
  const handleAddReview = async (reviewData) => {
    const token = localStorage.getItem("token");

    // Hardcoded for testing (Butters' completed appointment)
    const appointmentId = validAppointmentId;

    try {
      const response = await fetch(`${API_URL}/api/reviews/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          appointment_id: appointmentId,
          rating: reviewData.rating,
          comment: reviewData.comment,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Review successfully sent to the database!");

        // Instantly update the UI so the user sees their new review without refreshing
        const newReview = {
          userName: "You",
          review: reviewData.comment,
          rating: reviewData.rating,
        };
        setReviews([...reviews, newReview]);
        setHasAppointment(false); // Hide the "Add a Review" button after submission
      } else {
        alert(
          "❌ Error: " +
            (data.error || data.msg || "Unknown error"),
        );
      }
    } catch (error) {
      console.error("Network error submitting review:", error);
      alert("❌ Network Error. Please try again later.");
    }
  };

  // CHECK FOR COMPLETED APPOINTMENT
  useEffect(() => {
    const checkAppointmentStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) return; // Don't check if they aren't logged in

      try {
        const response = await fetch(`${API_URL}/api/appointments/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) throw new Error("Failed to fetch appointments");

        const data = await response.json();

        // 1. Decode the JWT token to get Bad Bunny's user ID
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const currentUserId = tokenPayload.sub || tokenPayload.id || tokenPayload.user_id; 

        // 2. Find the appointment matching the provider, status, AND the user
        console.log("Looking for Provider:", providerID.id, "User:", currentUserId);
        console.log("Backend Appointments Array:", data.appointments);
        const completedAppt = data.appointments.find((appt) => {
            const apptOwnerId = appt.user_id || appt.customer_id || (appt.pet && appt.pet.owner_id);
            
            return (
              String(appt.provider_id) === String(providerID.id) && // <-- STRING CONVERSION ADDED HERE
              appt.status === "COMPLETED" &&
              String(apptOwnerId) === String(currentUserId)
            );
        });

        if (completedAppt) {
          setHasAppointment(true); // Reveals the "Add a Review" button
          setValidAppointmentId(completedAppt.id); // Saves Bad Bunny's REAL ID!
        } else {
          setHasAppointment(false); // Hides the button if they haven't visited
        }
      } catch (error) {
        console.error("Error checking appointments:", error);
      }
    };

    if (providerID.id) {
      checkAppointmentStatus();
    }
  }, [providerID]);

  return (
    <div className="appointment-page">
      <div className="appointment-container">
        <div className="provider-content">
          <h1 className="mb-4">{provider.name}</h1>
          <div className="provider-img-container">
            <img src={provider.img_url} alt="provider-image" />
          </div>

          <div className="provider-details">{provider.description}</div>

          <div className="provider-info">
            <div className="provider-address flex-gap">
              <img src={LocationIcon} alt="Bootstrap" />
              <span>{provider.address}</span>
            </div>
            <div className="provider-email flex-gap">
              <img src={EmailIcon} alt="Bootstrap" />
              <span> {provider.email}</span>
            </div>
            <div className="provider-number flex-gap">
              <img src={PhoneIcon} alt="Bootstrap" />
              <span>{provider.phone}</span>
            </div>
          </div>
        </div>
        <div className="bookings">
          <div className="bookings-banner">
            <h3>Make a booking</h3>
          </div>
          <div className="bookings-container">
            <div className="date-container">
              <DateStep
                value={selectedDate}
                onChange={previewMode ? () => {} : setSelectedDate}
                sx={{
                  margin: 0,
                  padding: 0,
                  transform: "scale(1.2)",
                  alignSelf: "flex-start",
                }}
              />
            </div>
            <div className="time-container">
              <TimeStep
                selectedTime={selectedTime}
                setSelectedTime={previewMode ? () => {} : setSelectedTime}
                times={availableTimes}
              />
            </div>
          </div>
          {!previewMode && selectedTime != "" && (
            <div className="action-btn-container">
              <button
                className="action-btn-format grey-btn"
                onClick={() => {
                  setSelectedTime("");
                }}
              >
                Cancel
              </button>
              <button
                className="action-btn-format navy-btn"
                onClick={openPopup}
              >
                Book
              </button>
            </div>
          )}
        </div>

        {/* Booking Sequence */}
        {!previewMode && isPopupOpen && (
          <div className="provider-modal-overlay">
            <div className="provider-modal">
              {step === 1 && (
                <BookingSteps1
                  closePopup={closePopup}
                  onNext={handleNext}
                  services={provider.services}
                />
              )}
              {step === 2 && (
                <BookingSteps2
                  closePopup={closePopup}
                  handleNext={handleNext}
                  goBack={goBack}
                />
              )}
              {step === 3 && (
                <BookingSteps3
                  closePopup={closePopup}
                  bookingData={bookingData}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  address={provider.address}
                />
              )}
            </div>
          </div>
        )}

        {/* Reviews section - only show if user has completed appointment */}
        {!previewMode && (
          <ReviewList
            title={`${provider.name} Reviews`}
            reviews={reviews}
            hasAppointment={hasAppointment}
            onAddReview={handleAddReview}
          />
        )}
      </div>
    </div>
  );
}
