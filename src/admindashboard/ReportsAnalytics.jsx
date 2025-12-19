import React, { useEffect, useState } from 'react';
import axios from 'axios';

import AdminSidebar from '../comp/AdminSidebar';
import Alerts from '../comp/Alerts';

import "../pagesstyles/dashboard.css";
import "../adminstyles/reportsanalytics.css";

const ReportsAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const showAlert = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setTimeout(() => {
      setAlertType(null);
      setAlertMessage('');
    }, 3000);
  };

  const fetchAnalytics = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [
        ordersRes,
        paymentsRes,
        usersRes,
        reviewsRes,
        samplesRes
      ] = await Promise.all([
        axios.get('https://genglow-backend.vercel.app/api/admins/orders', { headers }),
        axios.get('https://genglow-backend.vercel.app/api/admins/payments', { headers }),
        axios.get('https://genglow-backend.vercel.app/api/admins/users', { headers }),
        axios.get('https://genglow-backend.vercel.app/api/admins/reviews', { headers }),
        axios.get('https://genglow-backend.vercel.app/api/admins/samples', { headers })
      ]);

      const orders = ordersRes.data || [];
      const payments = paymentsRes.data || [];
      const users = usersRes.data || [];
      const reviews = reviewsRes.data || [];
      const samples = samplesRes.data || [];

      const totalRevenue = payments.reduce(
        (sum, p) => sum + (p.amount || 0),
        0
      );

      setStats({
        totalUsers: users.length,
        totalOrders: orders.length,
        totalPayments: payments.length,
        totalRevenue,
        totalReviews: reviews.length,
        totalSamples: samples.length,

        pendingOrders: orders.filter(o => o.status === 'Pending').length,
        completedOrders: orders.filter(o => o.status === 'Completed').length,
        cancelledOrders: orders.filter(o => o.status === 'Cancelled').length,

        pendingSamples: samples.filter(s => s.status === 'Pending').length
      });

    } catch (err) {
      console.error(err.response?.data || err.message);
      showAlert('error', 'Failed to load reports & analytics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <AdminSidebar />

      <main className="main-content reports-analytics">
        {alertType && <Alerts type={alertType} message={alertMessage} />}

        {loading ? (
          <div className="loading-state">Loading analytics...</div>
        ) : (
          <>
            <h2 className="page-title">Reports & Analytics</h2>

            {/* KPI CARDS */}
            <div className="stats-grid">
              <div className="stat-card">
                <span>Total Users</span>
                <strong>{stats.totalUsers}</strong>
              </div>

              <div className="stat-card">
                <span>Total Orders</span>
                <strong>{stats.totalOrders}</strong>
              </div>

              <div className="stat-card">
                <span>Total Revenue</span>
                <strong>${stats.totalRevenue}</strong>
              </div>

              <div className="stat-card">
                <span>Total Reviews</span>
                <strong>{stats.totalReviews}</strong>
              </div>

              <div className="stat-card">
                <span>Total Samples</span>
                <strong>{stats.totalSamples}</strong>
              </div>
            </div>

            {/* STATUS BREAKDOWN */}
            <div className="card">
              <h3 className="card-title">Order Status Overview</h3>

              <div className="status-row">
                <span>Pending Orders</span>
                <span>{stats.pendingOrders}</span>
              </div>

              <div className="status-row">
                <span>Completed Orders</span>
                <span>{stats.completedOrders}</span>
              </div>

              <div className="status-row">
                <span>Cancelled Orders</span>
                <span>{stats.cancelledOrders}</span>
              </div>

              <div className="status-row">
                <span>Pending Samples</span>
                <span>{stats.pendingSamples}</span>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ReportsAnalytics;
