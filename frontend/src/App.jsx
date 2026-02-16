import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";

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
import { AuthContext } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute.jsx";

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Header />
        {/* Grace Header here */}
        <Avatar user={user} />

        <Routes>
          {/* Public routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          {/* Private routes - Protected */}
          {/* <Route element={<ProtectedRoute />}> */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/edit-pet/:petId" element={<EditPetDetails />} /> //edit individual pet
            <Route path="/pets" element={<AllPets />} /> // all pets
            <Route path="/user" element={<UserProfile />} />
            <Route path="/appointments" element={<Appointments />} />
          {/* </Route> */}
          {/* more pages coming ... */}
        </Routes>

        {/* Grace Footer here */}
      <Footer />
    </>
  );
}
