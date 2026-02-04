import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import PetProfile from "./pages/PetProfile.jsx";
import Booking from "./pages/Booking.jsx";
import Appointments from "./pages/Appointments.jsx";
import MedicalHistory from "./pages/MedicalHistory.jsx";
import Account from "./pages/Account.jsx";
import Avatar from "./components/avatar/Avatar.jsx";

export default function App() {
  return (
    <>

      {/* Grace Header here */}
      <Avatar user={{ name: "Sylvia", avatarUrl: null }} />

      <Routes>
        {/* Register and Login page? */}
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pets/:id" element={<PetProfile />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/medical-history" element={<MedicalHistory />} />
        <Route path="/pet-profile" element={<PetProfile />} />
        <Route path="/account" element={<Account />} />
        {/* more pages coming ... */}
      </Routes>

      {/* Grace Footer here */}
    </>
  );
}
