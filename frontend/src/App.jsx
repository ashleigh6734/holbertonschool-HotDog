import { Routes, Route, Navigate } from "react-router-dom";
// import { useState } from "react";
// import { useContext } from "react";

import Header from "./components/Header/Header.jsx";
// import UserHeader from "./components/Header/UserHeader.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Home from "./pages/Home/Home.jsx";
import About from "./pages/About/About.jsx";
import Services from "./pages/ServicesPage/Services.jsx";

//Provider Nav
// import ProviderNav from "./components/Header/ProviderNav.jsx";
// import ProviderDashboard from "./pages/ProviderPages/ProviderDashboard/ProviderDashboard.jsx";
import PatientList from "./pages/ProviderPages/PaitentList/PatientList.jsx";
import ProviderEditPetDetails from "./pages/ProviderPages/PaitentList/ProviderEditPetDetails.jsx";
import ProviderPetProfile from "./pages/ProviderPages/PaitentList/ProviderPetProfile.jsx";
// import ProviderBookings from "./pages/ProviderPages/ProviderDashboard/ProviderBookings.jsx";
// import Reminders from "./pages/ProviderPages/ProviderDashboard/Reminders.jsx";
import Account from "./pages/ProviderPages/Account/Account.jsx";



// Need to delet after done
import FormAddPet from "./components/AddPetsForm/FormAddPet.jsx";


import Booking from "./pages/Booking.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Login from "./pages/Login/Login.jsx";
import EditPetDetails from "./pages/PetProfile/EditPetDetails.jsx";
import PetProfile from "./pages/PetProfile/PetProfile.jsx";
import Register from "./pages/Register/Register.jsx";
import UserProfile from "./pages/UserProfile/UserProfile.jsx";
import AllPets from "./pages/PetProfile/AllPets.jsx";
import Appointments from "./pages/Appointments/Appointments.jsx";
import ManageAppointments from "./pages/ManageAppointments/ManageAppointments.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute.jsx";

export default function App() {
  return (
    <>
      <Header />
      {/* <ProviderNav /> */}

      <main className="main">
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />

          {/* PROVIDER PAGES */}
          {/* <Route path="/ProviderDashboard" element={<Dashboard />} /> */}
          {/* <Route path="/ProviderBookings" element={<Booking />} /> */}
          <Route path="/PatientList" element={<PatientList />} />
          <Route path="/ProviderEditPetDetails/:petId" element={<ProviderEditPetDetails />} />
          <Route path="/ProviderPetProfile/:petId" element={<ProviderPetProfile/>} />
          <Route path="/Account" element={<Account/>} />



          {/* will need to delete */}
          <Route path="/FormAddPet" element={<FormAddPet/>} />



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
          <Route path="/manage-appointments" element={<ManageAppointments />} />
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
