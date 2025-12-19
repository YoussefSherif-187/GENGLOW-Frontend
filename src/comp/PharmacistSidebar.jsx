import React from 'react';
import { useLocation } from 'react-router-dom';
import "../pagesstyles/dashboard.css";

const PharmacistSidebar = () => {
  const location = useLocation();

  const pageTitles = {
    '/pharmacist': 'Quiz Results',
    '/pharmacist/quizzes': 'Quiz Results',
    '/pharmacist/samples': 'Approved Samples',
    '/pharmacist/exams': 'Examination Booking',
    '/pharmacist/products': 'Add Products',
  };

  const currentTitle = pageTitles[location.pathname] || 'Pharmacist Dashboard';

  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">{currentTitle}</h1>

      <nav className="sidebar-nav">
        <a href="/pharmacist/quizzes" className="sidebar-link">Quiz Results</a>
        <a href="/pharmacist/samples" className="sidebar-link">Approved Samples</a>
        <a href="/pharmacist/exams" className="sidebar-link">Examination Booking</a>
        <a href="/pharmacist/products" className="sidebar-link">Add Products</a>
      </nav>
    </aside>
  );
};

export default PharmacistSidebar;
