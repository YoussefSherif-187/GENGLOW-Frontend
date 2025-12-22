import React, { useEffect, useState, useContext, useRef } from "react";
import { NavLink } from "react-router-dom";
import { CartContext } from "../cart/CartContext";

import userpic from "../assets/1077114.png";
import logo from "../assets/genlogo.png";
import navcart from "../assets/cart.png";

import "../app.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const { cart, setIsOpen } = useContext(CartContext);

  /* 🔄 Sync auth state */
  useEffect(() => {
    const syncAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", syncAuth);
    const interval = setInterval(syncAuth, 500);

    return () => {
      window.removeEventListener("storage", syncAuth);
      clearInterval(interval);
    };
  }, []);

  /* ❌ Close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* 🚪 Logout */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    window.location.href = "/home";
  };

  /* 🔹 Dashboard route by role */
  const getDashboardPath = () => {
    if (role === "admin") return "/admin";
    if (role === "pharmacist") return "/pharmacist";
    return "/user";
  };

  /* 🛒 Cart visibility */
  const showUserCart = isLoggedIn && role === "user";

  return (
    <header className="nav">
      <div className="nav-inner">
        {/* LOGO */}
        <a href="/home" className="logo">
          <img src={logo} alt="GenGlow Logo" />
        </a>

        {/* NAV LINKS */}
        <nav className="bar">
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/aboutus">About GenGlow</NavLink>
          <NavLink to="/requestsample">Try a Sample</NavLink>
          <NavLink to="/bookexam">Book an Examination</NavLink>
        </nav>

        {/* RIGHT SIDE */}
        <div className="nav-right">
          {/* QUIZ BUTTON */}
          <NavLink to="/genquiz" className="quiz-outline-btn">
            Genetic Quiz
          </NavLink>

          {/* USER DROPDOWN */}
          <div
            className={`user-dropdown ${dropdownOpen ? "open" : ""}`}
            ref={dropdownRef}
          >
            <img
              src={userpic}
              alt="User Icon"
              className="user-icon"
              onClick={() => setDropdownOpen((prev) => !prev)}
            />

            <div className="dropdown-content">
              {!isLoggedIn ? (
                <>
                  <a href="/signin" onClick={() => setDropdownOpen(false)}>
                    Sign In
                  </a>
                  <a href="/signup" onClick={() => setDropdownOpen(false)}>
                    Sign Up
                  </a>
                </>
              ) : (
                <>
                  <a
                    href={getDashboardPath()}
                    onClick={() => setDropdownOpen(false)}
                  >
                    Dashboard
                  </a>
                  <button className="logout-btn" onClick={handleLogout}>
                    Log Out
                  </button>
                </>
              )}
            </div>
          </div>

          {/* CART ICON */}
          {showUserCart && (
            <div
              className="cart-icon-wrapper"
              onClick={() => setIsOpen(true)}
            >
              <img src={navcart} alt="Cart" className="cart-icon" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
