export default function DashboardHero({
  name = "there",
  displayGreeting = true,
  title,
}) {

  //Greeting message
  const hour = new Date().getHours();

  let greeting = "Hello";
  if (hour < 12) {
    greeting = "Good morning";
  }
  else if (hour < 17) {
    greeting = "Good afternoon";
  }
  else {
    greeting = "Good evening";
  }

  return (
    <>
    
      {displayGreeting && name && (
        <p className="intro-hi">
          {greeting} {name}
        </p>
      )}

      <section className="intro">
        <h1 className="intro-title">
          {title}
        </h1>
      </section>
    </>
  );
}