import React, { useEffect, useState, useContext } from 'react';
import userpic from '../assets/1077114.png';
import logo from '../assets/genlogo.png';
import navcart from '../assets/cart.png';
import "../app.css";
import { NavLink } from "react-router-dom";
import { CartContext } from "../cart/CartContext";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const { cart, setIsOpen } = useContext(CartContext);

  // Sync auth + role
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    window.location.href = "/home";
  };

  // 🔹 Decide dashboard path based on role
  const getDashboardPath = () => {
    if (role === "admin") return "/admin";
    if (role === "pharmacist") return "/pharmacist";
    return "/user";
  };

  // 🔐 Cart visibility rule
  const showUserCart = isLoggedIn && role === "user";

  return (
    <header className="nav">
      <div className="nav-inner">
        {/* Logo */}
        <a href="/home" className="logo">
          <img src={logo} alt="GenGlow Logo" />
        </a>

        {/* Navigation Links */}
        <nav className="bar">
          <NavLink to="/shop" onClick={() => window.scrollTo(0, 0)}>Shop</NavLink>
          <NavLink to="/aboutus" onClick={() => window.scrollTo(0, 0)}>About GenGlow</NavLink>
          <NavLink to="/requestsample" onClick={() => window.scrollTo(0, 0)}>Try a Sample</NavLink>
          <NavLink to="/bookexam" onClick={() => window.scrollTo(0, 0)}>Book an Examination</NavLink>
        </nav>

        {/* Right Section */}
        <div className="nav-right">
          <div className="quizbtn">
            <NavLink
              to="/genquiz"
              className="quiz-outline-btn"
              onClick={() => window.scrollTo(0, 0)}
            >
              Genetic Quiz
            </NavLink>
          </div>

          {/* USER DROPDOWN */}
          <div className="user-dropdown">
            <img src={userpic} alt="User Icon" className="user-icon" />
            <div className="dropdown-content">
              {!isLoggedIn ? (
                <>
                  <a href="/signin">Sign In</a>
                  <a href="/signup">Sign Up</a>
                </>
              ) : (
                <>
                  <a href={getDashboardPath()}>Dashboard</a>
                  <button className="logout-btn" onClick={handleLogout}>
                    Log Out
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 🛒 CART (users only) */}
          {showUserCart && (
            <div className="cart-icon-wrapper" onClick={() => setIsOpen(true)}>
              <img src={navcart} alt="Cart" className="cart-icon" />
              
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
