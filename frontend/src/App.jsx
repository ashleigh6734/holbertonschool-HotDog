import { Routes, Route, Navigate } from "react-router-dom";
// import { useState } from "react";
// import { useContext } from "react";

import Header from "./components/Header/Header.jsx";
import UserHeader from "./components/Header/UserHeader.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Home from "./pages/Home/Home.jsx";
import About from "./pages/About/About.jsx";
import Services from "./pages/ServicesPage/Services.jsx";

import Booking from "./pages/Booking.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Login from "./pages/Login/Login.jsx";
import EditPetDetails from "./pages/PetProfile/EditPetDetails.jsx";
import PetProfile from "./pages/PetProfile/PetProfile.jsx";
import Register from "./pages/Register/Register.jsx";
import UserProfile from "./pages/UserProfile/UserProfile.jsx";
import AllPets from "./pages/PetProfile/AllPets.jsx";
import Appointments from "./pages/Appointments/Appointments.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute.jsx";

export default function App() {
  return (
    <>
      <Header />

      <main className="main">
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          {/* Private routes - commented out for now to avoid redirects || DO NOT DELETE */}
          {/* <Route element={<ProtectedRoute />}> */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/booking" element={<Booking />} />
          {/* //edit individual pet */}
          <Route path="/edit-pet/:petId" element={<EditPetDetails />} />
          {/* // all pets */}
          <Route path="/pets" element={<AllPets />} />
          <Route path="/user" element={<UserProfile />} />
          <Route path="/appointments/:id" element={<Appointments />} />
          {/* </Route> */}
          {/* more pages coming ... */}
          <Route path="*" element={<h1>404 — Route Not Found</h1>} />
        </Routes>
      </main>

      {/* Grace Footer here */}
      <Footer />
    </>
  );
}
