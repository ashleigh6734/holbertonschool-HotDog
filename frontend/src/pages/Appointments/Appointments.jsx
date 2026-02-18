import dayjs from "dayjs";
import { useState, useEffect } from "react";
import "./Appointments.css";
import DateStep from "./DateStep";
import TimeStep from "./TimeStep";
import { ReviewList } from "../../components/Review";

export default function Appointments() {
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(today); // store selected date
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [isActive, setIsActive] = useState(false);
  // Dummy reviews data - this would come from backend API
  const [reviews, setReviews] = useState([
    {
      userName: 'John Smith',
      review: 'Great service! The staff was very professional and caring. My pet felt comfortable throughout the appointment.',
      rating: 5
    },
    {
      userName: 'Sarah Johnson',
      review: 'Good experience overall. Clean facility and friendly team. Highly recommended!',
      rating: 4
    },
    {
      userName: 'Mike Davis',
      review: 'Excellent veterinary care. They took time to explain everything clearly.',
      rating: 5
    }
  ]);
  const [hasAppointment] = useState(true); // This is to check if user has completed appointment

  console.log(isActive, "debug");
  console.log(selectedTime, "selectedTime");

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      // DUMMY AVAILABLE TIME SLOTS
      const dummyTimes = [
        { date: "2026-02-01", slots: ["9:00AM", "10:30AM"] },
        {
          date: "2026-02-17",
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
        { date: "2026-02-18", slots: ["9:30AM", "11:00AM", "3:30PM"] },
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
    console.log('New review submitted:', reviewData);
    
    // For demo purposes, add to local state
    const newReview = {
      userName: 'Current User', // This would come from logged-in user
      review: reviewData.comment,
      rating: reviewData.rating
    };
    
    setReviews([...reviews, newReview]);
  };

  return (
    <div className="appointment-page">
      <div className="appointment-container">
        <div className="provider-content">
          <h1>All Things Pets Clinic</h1>
          <div className="provider-img-container">
            <img
              src="src/assets/images/vet-clinic-1.jpg"
              alt="provider-image"
            />
          </div>

          <div className="provider-info">
            <div className="provider-address flex-gap">
              <img src="src/assets/icons/geo-alt.svg" alt="Bootstrap" />
              <span>12 South Street, Melbourne 3000</span>
            </div>
            <div className="provider-email flex-gap">
              <img src="src/assets/icons/email.svg" alt="Bootstrap" />
              <span> allthingspetsclinic@businessemail.com</span>
            </div>
            <div className="provider-number flex-gap">
              <img src="src/assets/icons/phone.svg" alt="Bootstrap" />
              <span>0427 272 783</span>
            </div>
          </div>
          <div className="provider-details">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
            volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
            ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo
            consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate
            velit esse
          </div>
        </div>
        <div className="bookings">
          <div className="bookings-banner">Make a booking</div>
          <div className="bookings-container">
            <div className="date-container">
              <DateStep value={selectedDate} onChange={setSelectedDate} />
            </div>
            <div className="time-container">
              <TimeStep
                onSelect={setIsActive}
                className={isActive ? "active-btn time-button" : "time-button"}
                onClick={setSelectedTime}
                times={availableTimes}
              />
            </div>
            {/* <p>{JSON.stringify(selectedDate)}</p> */}
          </div>
          {selectedTime != "" && (
            <div className="action-btn-container">
              <button className="action-btn-format grey-btn">Cancel</button>
              <button className="action-btn-format navy-btn">Book</button>
            </div>
          )}
        </div>
        {/* Reviews section - only show if user has completed appointment */}
        <ReviewList 
          title="All Things Pets Clinic Reviews"
          reviews={reviews}
          hasAppointment={hasAppointment}
          onAddReview={handleAddReview}
        />
      </div>
    </div>
  );
}
