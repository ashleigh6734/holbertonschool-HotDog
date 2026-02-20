export default function DashboardHero({ name = "there" }) {
  return (
    <section className="intro">
      <p className="intro-hi">Hi {name}</p>
      <h1 className="intro-title">
        Welcome to HotDog, where quality care and everything your pet needs come together.
      </h1>
    </section>
  );
}