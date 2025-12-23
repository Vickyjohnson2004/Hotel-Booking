import React, { useContext } from "react";
import Navbar from "../../components/HotelOwner/Navbar";
import Sidebar from "../../components/HotelOwner/Sidebar";
import { AppContext } from "../../context/AppContext";
import { Outlet } from "react-router-dom";
import UserDashboard from "../UserDashboard";

const Layout = () => {
  const { user, loading } = useContext(AppContext);

  if (loading) {
    // Show loading spinner while user is being fetched
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Redirect or fallback if user is not logged in
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        Please login to access this page.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex h-full">
        {user.role === "admin" ? (
          <>
            <Sidebar />
            <div className="flex-1 p-4 pt-10 md:px-10 h-full">
              <Outlet /> {/* Dashboard, AddRoom, ListRoom */}
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 p-4 pt-10 md:px-10 h-full">
              <UserDashboard /> {/* Normal user dashboard */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Layout;
