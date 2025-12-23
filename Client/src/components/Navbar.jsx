import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/rooms" },
    { name: "Experience", path: "/experience" },
    { name: "About", path: "/about" },
  ];

  // Handle scroll for navbar background/shadow
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    setIsScrolled(location.pathname !== "/"); // non-home pages
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderAuthButtons = () => {
    if (user) {
      return (
        <>
          {/* All logged-in users get Dashboard */}
          <button
            onClick={() =>
              navigate(user?.role === "admin" ? "/admin" : "/dashboard")
            }
            className="px-4 py-1 text-sm border rounded-full"
          >
            Dashboard
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-1 text-sm border rounded-full"
          >
            Logout
          </button>
        </>
      );
    } else {
      return (
        <>
          <button
            onClick={() => navigate("/login")}
            className={`px-6 py-2 rounded-full transition-all duration-500 ${
              isScrolled ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className={`px-6 py-2 rounded-full transition-all duration-500 border ${
              isScrolled ? "border-black text-black" : "border-white text-white"
            }`}
          >
            Signup
          </button>
        </>
      );
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
        isScrolled
          ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4"
          : "py-4 md:py-6 text-white"
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <img
          src={assets.logo}
          alt="logo"
          className={`h-9 transition-all duration-500 ${
            isScrolled ? "invert opacity-80" : ""
          }`}
        />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className={`relative group flex flex-col gap-0.5 ${
              isScrolled ? "text-gray-700" : "text-white"
            }`}
          >
            {link.name}
            <span
              className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all ${
                isScrolled ? "bg-gray-700" : "bg-white"
              }`}
            />
          </Link>
        ))}
        {renderAuthButtons()}
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3 md:hidden">
        <img
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          src={assets.menuIcon}
          alt="menuIcon"
          className={`${isScrolled ? "invert" : ""} h-4 cursor-pointer`}
        />
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white flex flex-col items-center justify-center gap-6 text-gray-800 font-medium text-base transition-transform duration-500 md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <img src={assets.closeIcon} alt="close" className="h-6" />
        </button>

        {navLinks.map((link, i) => (
          <Link key={i} to={link.path} onClick={() => setIsMenuOpen(false)}>
            {link.name}
          </Link>
        ))}

        {user ? (
          <>
            {/* All logged-in users get Dashboard */}
            <button
              onClick={() => {
                navigate(user?.role === "admin" ? "/admin" : "/dashboard");
                setIsMenuOpen(false);
              }}
              className="px-4 py-1 text-sm border rounded-full"
            >
              Dashboard
            </button>

            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="px-4 py-1 text-sm border rounded-full"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                navigate("/login");
                setIsMenuOpen(false);
              }}
              className="px-8 py-2.5 rounded-full bg-black text-white"
            >
              Login
            </button>
            <button
              onClick={() => {
                navigate("/signup");
                setIsMenuOpen(false);
              }}
              className="px-8 py-2.5 rounded-full border border-black text-black"
            >
              Signup
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
