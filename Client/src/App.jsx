import Navbar from "./components/Navbar";
import React, { useEffect } from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import AllRooms from "./pages/AllRooms";
import RoomDetails from "./pages/RoomDetails";
import MyBookings from "./pages/MyBookings";
import About from "./pages/About";
import Layout from "./pages/HotelOwner/Layout";
import Dashboard from "./pages/HotelOwner/Dashboard";
import AddRoom from "./pages/HotelOwner/AddRoom";
import ListRoom from "./pages/HotelOwner/ListRoom";
import AdminTestimonials from "./pages/HotelOwner/AdminTestimonials";
import Offers from "./pages/HotelOwner/Offers";
import UserDashboard from "./pages/UserDashboard";
import api from "./services/api";
import Login from "./components/Login";
import Signup from "./components/Signup";
import HotelReg from "./components/HotelReg";
import { Toaster } from "react-hot-toast";

function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <>
      <Toaster position="top-center" />
      {/* Show Navbar/Footer only on public routes */}
      {!isAdminPath && <Navbar />}
      <div className="min-h-[70vh]">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/dashboard" element={<UserDashboard />} />

          {/* Admin routes */}
          <Route path="/admin" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListRoom />} />
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="register" element={<HotelReg />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="offers" element={<Offers />} />
          </Route>
        </Routes>
      </div>
      {!isAdminPath && <Footer />}
    </>
  );
}

export default App;
