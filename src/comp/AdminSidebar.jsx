import React from 'react';
import { useLocation } from 'react-router-dom';
import "../pagesstyles/dashboard.css";

const AdminSidebar = () => {
  const location = useLocation();

  const pageTitles = {
    '/admin': 'Reports & Analytics',
    '/admin/reports': 'Reports & Analytics',
    '/admin/users': 'All Users',
    '/admin/products': 'All Products',
    '/admin/orders': 'All Orders',
    '/admin/payments': 'All Payments',
    '/admin/samples': 'All Sample Requests',
    '/admin/allexams': 'All Exam Results',    
    '/admin/quizzes': 'All Quiz Results',
    '/admin/supplier': 'Supplier Management',    
    '/admin/shipping': 'Shipping Partner Management',
  };

  const currentTitle = pageTitles[location.pathname] || 'Admin Dashboard';

  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">{currentTitle}</h1>

      <nav className="sidebar-nav">
        <a href="/admin/reports" className="sidebar-link">
          Reports & Analytics
        </a>
        <a href="/admin/users" className="sidebar-link">
          All Users
        </a>
        <a href="/admin/products" className="sidebar-link">
          All Products
        </a>
        <a href="/admin/orders" className="sidebar-link">
          All Orders
        </a>
        <a href="/admin/payments" className="sidebar-link">
          All Payments
        </a>
        <a href="/admin/samples" className="sidebar-link">
          All Sample Requests
        </a>
        <a href="/admin/allexams" className="sidebar-link">
          All Exam Results
        </a>
        <a href="/admin/quizzes" className="sidebar-link">
          All Quiz Results
        </a>
        <a href="/admin/supplier" className="sidebar-link">
          Supplier Management
        </a>
        <a href="/admin/shipping" className="sidebar-link">
          Shipping Partner Management
        </a>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
