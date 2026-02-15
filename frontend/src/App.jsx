import { Routes, Route } from "react-router-dom";
import Booking from "./pages/Booking.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import EditPetDetails from "./pages/PetProfile/editPetDetails.jsx";
import PetProfile from "./pages/PetProfile/PetProfile.jsx";
import Register from "./pages/Register/Register.jsx";
import Avatar from "./components/avatar/Avatar.jsx";
import UserProfile from "./pages/UserProfile/UserProfile.jsx";
import AllPets from "./pages/PetProfile/AllPets.jsx";
import Appointments from "./pages/Appointments/Appointments.jsx";
import ReviewDemo from "./pages/ReviewDemo.jsx";

export default function App() {
  return (
    <>
      {/* Grace Header here */}
      <Avatar user={{}} />

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/edit-pet/:petId" element={<EditPetDetails />} /> //edit individual pet
        <Route path="/pets" element={<AllPets />} /> // all pets
        <Route path="/user" element={<UserProfile />} />
        <Route path="/appointments/:id" element={<Appointments />} />
        <Route path="/review-demo" element={<ReviewDemo />} />
        {/* more pages coming ... */}
      </Routes>

      {/* Grace Footer here */}
    </>
  );
}
