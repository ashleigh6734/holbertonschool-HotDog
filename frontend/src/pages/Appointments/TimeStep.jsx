// dynamically render the available times as indiv buttons when click on selected date
import "./TimeStep.css";

export default function TimeStep({ times, setSelectedTime, selectedTime }) {
  const normalizedSlots = (times || []).map((slot) => {
    if (typeof slot === "string") {
      return { time: slot, is_booked: false };
    }

    return {
      time: slot.time,
      is_booked: Boolean(slot.is_booked),
    };
  });

  if (normalizedSlots.length === 0) {
    return "No times available";
  }

  return normalizedSlots.map((slot) => {
    const isSelected = slot.time === selectedTime && !slot.is_booked;
    const buttonClass = slot.is_booked
      ? "time-button time-button-booked"
      : isSelected
        ? "active-btn time-button time-button-available"
        : "time-button time-button-available";

    return (
      <button
        key={slot.time}
        type="button"
        className={buttonClass}
        disabled={slot.is_booked}
        onClick={(newTime) => {
          if (slot.is_booked) {
            return;
          }

          setSelectedTime(newTime.target.innerText);
        }}
      >
        {slot.time}
      </button>
    );
  });
}
