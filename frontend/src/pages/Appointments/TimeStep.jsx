// dynamically render the available times as indiv buttons when click on selected date

export default function TimeStep({ times, className, onClick }) {
  if (times.length === 0) {
    return "No times available for this date";
  }
  return times.map((time) => (
    <button className={className} onClick={(newTime) => onClick(newTime)}>
      {time}
    </button>
  ));
}
