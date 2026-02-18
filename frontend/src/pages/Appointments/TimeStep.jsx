// dynamically render the available times as indiv buttons when click on selected date

export default function TimeStep({ times, setSelectedTime, selectedTime }) {
  if (times.length === 0) {
    return "No times available for this date";
  }

  return times.map((time) => {
    return (
      <button
        className={
          time === selectedTime ? "active-btn time-button" : "time-button"
        }
        onClick={(newTime) => {
          setSelectedTime(newTime.target.innerText);
        }}
      >
        {time}
      </button>
    );
  });
}
