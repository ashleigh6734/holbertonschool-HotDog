import dayjs from "dayjs";
import { useState, useEffect } from "react";
import "./Appointments.css";
import DateStep from "./DateStep";
import TimeStep from "./TimeStep";
import { ReviewList } from "../../components/Review";
import { useParams } from "react-router-dom";
import LocationIcon from "../../assets/icons/geo-alt.svg";
import EmailIcon from "../../assets/icons/email.svg";
import PhoneIcon from "../../assets/icons/phone.svg";

export default function Appointments() {
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

  // FETCH SERVICE PROVIDER DETAILS
  useEffect(() => {
    const fetchProviderDetails = async () => {
      const API_URL = `/api/providers/${providerID.id}`;
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        setProvider(result);
        console.log(result, "result");
      } catch (error) {
        console.error(error.message, "error");
      }
    };
    fetchProviderDetails();
  }, [providerID]);

  // FETCH AVAILABLE TIME SLOTS (CONNECTED TO BACKEND)
  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!selectedDate || !providerID?.id) return;

      const formattedDate = selectedDate.format("YYYY-MM-DD");
      setSelectedTime(""); // Clear previously selected time when date changes

      try {
        // Hit the new dynamic backend endpoint
        const response = await fetch(
          `/api/providers/${providerID.id}/slots?date=${formattedDate}`,
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch time slots: ${response.status}`);
        }

        const data = await response.json();

        // Update the state with the live available slots from the database
        setAvailableTimes(data.available_slots || []);
      } catch (error) {
        console.error("Error fetching times from backend:", error);
        setAvailableTimes([]); // Fallback to empty array on error
      }
    };

    fetchAvailableTimes();
  }, [selectedDate, providerID]);

  // FETCH REAL REVIEWS FOR THIS PROVIDER (NEW!)
  useEffect(() => {
    const fetchReviews = async () => {
      const API_URL = `/api/reviews/provider/${providerID.id}`;

      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch reviews: ${response.status}`);
        }

        const data = await response.json();

        // The "Translator": Map the backend keys to the frontend keys
        const formattedReviews = data.map((backendReview) => ({
          userName: backendReview.author_name,
          review: backendReview.comment,
          rating: backendReview.rating,
        }));

        // Update the screen with the newly mapped data
        setReviews(formattedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [providerID]);

  // 4. SUBMIT A NEW REVIEW
  const handleAddReview = async (reviewData) => {
    const token = localStorage.getItem("token");

    // Hardcoded for testing (Butters' completed appointment)
    const appointmentId = validAppointmentId;

    try {
      const response = await fetch("/api/reviews/", {
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
          "❌ Backend rejected it: " +
            (data.error || data.msg || "Unknown error"),
        );
      }
    } catch (error) {
      console.error("Network error submitting review:", error);
      alert("❌ Network Error. Is your Flask backend running?");
    }
  };

  // CHECK FOR COMPLETED APPOINTMENT
  useEffect(() => {
    const checkAppointmentStatus = async () => {
      try {
        const response = await fetch("/api/appointments/list");
        if (!response.ok) throw new Error("Failed to fetch appointments");

        const data = await response.json();

        // Hunt for an appointment that matches THIS provider AND is COMPLETED
        const completedAppt = data.appointments.find(
          (appt) =>
            appt.provider_id === providerID.id && appt.status === "COMPLETED",
        );

        if (completedAppt) {
          setHasAppointment(true); // Reveals the "Add a Review" button
          setValidAppointmentId(completedAppt.id); // Saves the real ID!
        } else {
          setHasAppointment(false); // Hides the button if they haven't visited
        }
      } catch (error) {
        console.error("Error checking appointments:", error);
      }
    };

    checkAppointmentStatus();
  }, [providerID]);

  return (
    <div className="appointment-page">
      <div className="appointment-container">
        <div className="provider-content">
          <h1>{provider.name}</h1>
          <div className="provider-img-container">
            <img src={provider.img_url} alt="provider-image" />
          </div>

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
          <div className="provider-details">{provider.description}</div>
        </div>
        <div className="bookings">
          <div className="bookings-banner">
            <h3>Make a booking</h3>
          </div>
          <div className="bookings-container">
            <div className="date-container">
              <DateStep
                value={selectedDate}
                onChange={setSelectedDate}
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
                setSelectedTime={setSelectedTime}
                times={availableTimes}
              />
            </div>
          </div>
          {selectedTime != "" && (
            <div className="action-btn-container">
              <button
                className="action-btn-format grey-btn"
                onClick={() => {
                  setSelectedTime("");
                }}
              >
                Cancel
              </button>
              <button className="action-btn-format navy-btn">Book</button>
            </div>
          )}
        </div>
        {/* Reviews section - only show if user has completed appointment */}
        <ReviewList
          title={`${provider.name} Reviews`}
          Reviews
          reviews={reviews}
          hasAppointment={hasAppointment}
          onAddReview={handleAddReview}
        />
      </div>
    </div>
  );
}
