import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { getImageUrl } from "../../utils/media";

const Navbar = () => {
  // ✅ Get user from AuthContext
  const { user } = useContext(AppContext);
  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">
      <Link to="/">
        <img src={assets.logo} alt="logo" className="h-9 invert opacity-80" />
      </Link>
      {user ? (
        <div className="flex items-center gap-3">
          <img
            src={getImageUrl(user.image)}
            alt={user.username}
            className="h-9 w-9 rounded-full object-cover"
          />
          <div className="flex flex-col text-right">
            <span className="text-sm text-gray-500">Welcome</span>
            <span className="text-gray-700 font-medium">{user.username}</span>
          </div>
        </div>
      ) : (
        <Link to="/login" className="text-black font-medium">
          Login
        </Link>
      )}
    </div>
  );
};

export default Navbar;
