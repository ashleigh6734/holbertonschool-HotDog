// This simple header code is for testing Avatar, pls feel free to delete it
import Avatar from "../Avatar/Avatar";

export default function Header() {
  const mockUser = {
    name: "Veronica",
    avatarUrl: null
  };

  return (
    <header>
      <nav>
        <a href="/pets">Your Pets</a>
        <a href="/services">Services</a>
      </nav>

      <Avatar user={mockUser} />
    </header>
  );
}