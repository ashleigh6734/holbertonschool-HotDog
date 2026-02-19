export default function Stars({ value = 0 }) {
  const stars = Array.from({ length: 5 }, (_, i) => (i < value ? "★" : "☆"));
  return <div className="stars">{stars.join(" ")}</div>;
}