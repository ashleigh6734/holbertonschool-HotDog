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

  // Dummy reviews data - this would come from backend API
  const [reviews, setReviews] = useState([
    {
      userName: "John Smith",
      review:
        "Great service! The staff was very professional and caring. My pet felt comfortable throughout the appointment.",
      rating: 5,
    },
    {
      userName: "Sarah Johnson",
      review:
        "Good experience overall. Clean facility and friendly team. Highly recommended!",
      rating: 4,
    },
    {
      userName: "Mike Davis",
      review:
        "Excellent veterinary care. They took time to explain everything clearly.",
      rating: 5,
    },
  ]);
  const [hasAppointment] = useState(true); // This is to check if user has completed appointment

  // FETCH SERVICE PROVIDER DETAILS
  useEffect(() => {
    const fetchProviderDetails = async () => {
      const API_URL = `http://127.0.0.1:5000/api/providers/${providerID.id}`;
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

  // FETCH AVAILABLE TIME SLOTS
  useEffect(() => {
    const fetchAvailableTimes = async () => {
      // DUMMY AVAILABLE TIME SLOTS
      const dummyTimes = [
        { date: "2026-02-19", slots: ["9:00AM", "10:30AM"] },
        {
          date: "2026-02-20",
          slots: [
            "9:00AM",
            "9:30AM",
            "10:00AM",
            "1:00PM",
            "2:30PM",
            "4:00PM",
            "4:30PM",
            "5:00PM",
          ],
        },
        { date: "2026-02-21", slots: ["9:30AM", "11:00AM", "3:30PM"] },
      ];
      // Fetch available time slots based on selectedDate
      // if selectedDate is in the dummyTimes, return those slots, otherwise return an empty array
      if (selectedDate === null) return null;
      const formattedDate = selectedDate.format("YYYY-MM-DD");
      const dateSlot = dummyTimes.find((d) => d.date === formattedDate)
        ? dummyTimes.find((d) => d.date === formattedDate)
        : [];
      const timeSlot = dateSlot.slots ? dateSlot.slots : [];
      setAvailableTimes(timeSlot);
      setSelectedTime(""); //set selectedTime back to nothing when user clicks on a new date
    };
    fetchAvailableTimes();
  }, [selectedDate]);

  const handleAddReview = (reviewData) => {
    // This function should send the review data to the backend API
    console.log("New review submitted:", reviewData);

    // For demo purposes, add to local state
    const newReview = {
      userName: "Current User", // This would come from logged-in user
      review: reviewData.comment,
      rating: reviewData.rating,
    };

    setReviews([...reviews, newReview]);
  };

  return (
    <div className="appointment-page">
      <div className="appointment-container">
        <div className="provider-content">
          <h1>{provider.name}</h1>
          <div className="provider-img-container">
            <img src={provider.img} alt="provider-image" />
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
              <DateStep value={selectedDate} onChange={setSelectedDate} />
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
