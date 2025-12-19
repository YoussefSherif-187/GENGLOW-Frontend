import React from 'react'
import "../app.css"
import logo from "../assets/genlogo.png";



const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <img src={logo} alt="GenGlow" className="footer-logo" />
          <p className="footer-mission">
            Our mission is to provide clean, sustainable, and effective skincare that suits all skin types. We believe in transparency, cruelty-free testing, and environmentally conscious packaging.
          </p>
        </div>

        <div className="footer-links">
          <a href="home">Home</a>
          <a href="shop">Shop</a>      
          <a href="aboutus">About Us</a>
          <a href="contactus">Contact Us</a>
          <a href="requestsample">Try A Sample</a>
          <a href="bookexam">Book An Examination</a>
        </div>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        <span>Copyright © 2025 GenGlow. All Rights Reserved.</span>
        <div className="footer-legal">
          <a href="privacypolicy">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;