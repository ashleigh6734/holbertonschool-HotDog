import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";

import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import ProviderNav from "./components/Header/ProviderNav.jsx";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute.jsx";

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
import Booking from "./pages/Booking.jsx";
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
import PatientList from "./pages/ProviderPages/PaitentList/PatientList.jsx";
import ProviderEditPetDetails from "./pages/ProviderPages/PaitentList/ProviderEditPetDetails.jsx";
import ProviderPetProfile from "./pages/ProviderPages/PaitentList/ProviderPetProfile.jsx";
import ProviderBookings from "./pages/ProviderPages/ProviderBookings/ProviderBookings.jsx";
// import Reminders from "./pages/ProviderPages/ProviderDashboard/Reminders.jsx";
import Account from "./pages/ProviderPages/Account/Account.jsx";

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
    {/* Show TOP header if Guest + User */}
    {user?.role !== "provider" && <Header />}

    {/* Show Side Provider NavBar if Provider */}
    {user?.role === "provider" && <ProviderNav />}

      <main className={user?.role === "provider" ? "main with-sidebar" : "main"}>
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
          {/* PRIVATE routes - commented out for now to avoid redirects || DO NOT DELETE */}
          {/* <Route element={<ProtectedRoute allowedRole="user" />}> */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/edit-pet/:petId" element={<EditPetDetails />} />
          <Route path="/pets" element={<AllPets />} />
          <Route path="/user" element={<UserProfile />} />
          <Route path="/appointments/:id" element={<Appointments />} />
          <Route path="/manage-appointments" element={<ManageAppointments />} />
          {/* </Route> */}

          {/* =======================
              PROVIDER ROUTES (role: provider)
          ======================= */}
          {/* <Route path="/ProviderDashboard" element={<ProviderDashboard />} /> */}
          <Route
            path="/provider/appointments"
            element={(
              <ProtectedRoute allowedRole="provider">
                <ProviderBookings />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/PatientList"
            element={(
              <ProtectedRoute allowedRole="provider">
                <PatientList />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/ProviderEditPetDetails/:petId"
            element={(
              <ProtectedRoute allowedRole="provider">
                <ProviderEditPetDetails />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/ProviderPetProfile/:petId"
            element={(
              <ProtectedRoute allowedRole="provider">
                <ProviderPetProfile />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/Account"
            element={(
              <ProtectedRoute allowedRole="provider">
                <Account />
              </ProtectedRoute>
            )}
          />

          {/* =======================
              404 FALLBACK
          ======================= */}
          <Route path="*" element={<h1>404 — Route Not Found</h1>} />
        </Routes>
      </main>

      {user?.role !== "provider" && <Footer />}
    </>
  );
}
