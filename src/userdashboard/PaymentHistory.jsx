import React, { useEffect, useState } from 'react';
import axios from 'axios';

import UserSidebar from '../comp/Usersidebar';
import Alerts from '../comp/Alerts';

import "../pagesstyles/dashboard.css";
import "../userstyles/paymenthistory.css";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get(
          'https://genglow-backend.vercel.app/api/payments/my-payments',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setPayments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err.response?.data || err.message);
        showAlert('error', 'Failed to load payments');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const showAlert = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setTimeout(() => {
      setAlertType(null);
      setAlertMessage('');
    }, 3000);
  };

  return (
    <div className="layout">
      <UserSidebar />

      <main className="main-content payment-history">
        {alertType && <Alerts type={alertType} message={alertMessage} />}

        {loading ? (
          <div className="loading-state">Loading payments...</div>
        ) : payments.length === 0 ? (
          <div className="empty-state">No payment history found</div>
        ) : (
          <>
            <h2 className="page-title">Payment History</h2>

            {payments.map(payment => (
              <div className="card" key={payment._id}>
                <h3 className="card-title">Payment Summary</h3>

                <div className="payment-row">
                  <span>Payment ID</span>
                  <span>{payment._id}</span>
                </div>

                <div className="payment-row">
                  <span>Order ID</span>
                  <span>{payment.order?._id}</span>
                </div>

                <div className="payment-row">
                  <span>Method</span>
                  <span>{payment.method}</span>
                </div>

                <div className="payment-row">
                  <span>Payment Status</span>
                  <span className={`status ${payment.status.toLowerCase()}`}>
                    {payment.status}
                  </span>
                </div>

                <div className="payment-row">
                  <span>Order Status</span>
                  <span>{payment.order?.status}</span>
                </div>

                <div className="payment-row total">
                  <span>Amount</span>
                  <span>${payment.amount}</span>
                </div>

                <div className="payment-row">
                  <span>Payment Date</span>
                  <span>
                    {new Date(payment.paymentDate).toDateString()}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
};

export default PaymentHistory;
