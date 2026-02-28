import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";

import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import ProviderNav from "./components/Header/ProviderNav.jsx";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute.jsx";

// MUST DELETE
import BookingSteps from "./components/BookingSteps/BookingSteps.jsx";

/* =======================
   PUBLIC PAGES
======================= */
import Home from "./pages/Home/Home.jsx";
import About from "./pages/About/About.jsx";
import Services from "./pages/ServicesPage/Services.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";

/* =======================
   USER PAGES
======================= */
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import EditPetDetails from "./pages/PetProfile/EditPetDetails.jsx";
import UserProfile from "./pages/UserProfile/UserProfile.jsx";
import AllPets from "./pages/PetProfile/AllPets.jsx";
import Appointments from "./pages/Appointments/Appointments.jsx";
import ManageAppointments from "./pages/ManageAppointments/ManageAppointments.jsx";

/* =======================
   PROVIDER PAGES
======================= */
// import ProviderNav from "./components/Header/ProviderNav.jsx";
// import ProviderDashboard from "./pages/ProviderPages/ProviderDashboard/ProviderDashboard.jsx";
import PatientList from "./pages/ProviderPages/PatientList/PatientList.jsx";
import ProviderEditPetDetails from "./pages/ProviderPages/PatientList/ProviderEditPetDetails.jsx";
import ProviderPetProfile from "./pages/ProviderPages/PatientList/ProviderPetProfile.jsx";
import ProviderBookings from "./pages/ProviderPages/ProviderBookings/ProviderBookings.jsx";
// import Reminders from "./pages/ProviderPages/ProviderDashboard/Reminders.jsx";
import Account from "./pages/ProviderPages/Account/Account.jsx";
import ManageAppointmentProvider from "./pages/ProviderPages/ManageAppointmentsProvider/ManageAppointmentProvider.jsx";

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="app">
      {/* Show TOP header if Guest + User */}
      {user?.role !== "provider" && <Header />}

      {/* Show Side Provider NavBar if Provider */}
      {user?.role === "provider" && <ProviderNav />}

      <main
        className={user?.role === "provider" ? "main with-sidebar" : "main"}
      >
        <Routes>
          {/* =======================
              PUBLIC ROUTES
          ======================= */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          {/* =======================
              USER ROUTES (role: user)
          ======================= */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit-pet/:petId" element={<EditPetDetails />} />
          <Route path="/pets" element={<AllPets />} />
          <Route path="/user" element={<UserProfile />} />
          <Route path="/appointments/:id" element={<Appointments />} />
          <Route path="/manage-appointments" element={<ManageAppointments />} />
          {/* MUST DELETE -- GRACE */}
          <Route path="/BookingSteps" element={<BookingSteps />} />
          BookingSteps
          {/* </Route> */}
          {/* =======================
              PROVIDER ROUTES (role: provider)
          ======================= */}
          <Route
            path="/provider/appointments"
            element={
              <ProtectedRoute allowedRole="provider">
                <ProviderBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/PatientList"
            element={
              <ProtectedRoute allowedRole="provider">
                <PatientList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ProviderEditPetDetails/:petId"
            element={
              <ProtectedRoute allowedRole="provider">
                <ProviderEditPetDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ProviderPetProfile/:petId"
            element={
              <ProtectedRoute allowedRole="provider">
                <ProviderPetProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Account"
            element={
              <ProtectedRoute allowedRole="provider">
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/provider/manage-appointments"
            element={
              <ProtectedRoute allowedRole="provider">
                <ManageAppointmentProvider />
              </ProtectedRoute>
            }
          />
          {/* =======================
              404 FALLBACK
          ======================= */}
          <Route path="*" element={<h1>404 — Route Not Found</h1>} />
        </Routes>
      </main>

      {user?.role !== "provider" && <Footer />}
    </div>
  );
}
