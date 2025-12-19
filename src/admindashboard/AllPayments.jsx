import React, { useEffect, useState } from "react";
import axios from "axios";

import AdminSidebar from "../comp/AdminSidebar";
import Alerts from "../comp/Alerts";
import ConfirmModal2 from "../comp/ConfirmModal2";

import "../pagesstyles/dashboard.css";
import "../adminstyles/allpayments.css";

const AllPayments = () => {
  const token = localStorage.getItem("token");

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const [confirmPaymentId, setConfirmPaymentId] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const showAlert = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setTimeout(() => {
      setAlertType(null);
      setAlertMessage("");
    }, 3000);
  };

  // ================= FETCH =================
  const fetchPayments = async () => {
    try {
      const res = await axios.get(
        "https://genglow-backend.vercel.app/api/admins/payments",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPayments(Array.isArray(res.data) ? res.data : []);
    } catch {
      showAlert("error", "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  // ================= COMPLETE =================
  const handleCompletePayment = async () => {
    try {
      await axios.patch(
        `https://genglow-backend.vercel.app/api/payments/${confirmPaymentId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showAlert("success", "Payment marked as completed");
      setConfirmPaymentId(null);
      fetchPayments();
    } catch {
      showAlert("error", "Failed to complete payment");
    }
  };

  return (
    <div className="layout">
      <AdminSidebar />

      <main className="main-content all-payments">
        {alertType && <Alerts type={alertType} message={alertMessage} />}

        <ConfirmModal2
          show={!!confirmPaymentId}
          message="Mark this payment as completed?"
          confirmText="Yes, Complete Payment"
          cancelText="Cancel"
          onCancel={() => setConfirmPaymentId(null)}
          onConfirm={handleCompletePayment}
        />

        {loading ? (
          <div className="loading-state">Loading payments...</div>
        ) : payments.length === 0 ? (
          <div className="empty-state">No payments found</div>
        ) : (
          <>
            <h2 className="page-title">All Payments</h2>

            {payments.map(payment => (
              <div className="card" key={payment._id}>
                <h3 className="card-title">Payment Details</h3>

                <div className="payment-row">
                  <span>Payment ID</span>
                  <span>{payment._id}</span>
                </div>

                <div className="payment-row">
                  <span>Order ID</span>
                  <span>{payment.order?._id || "N/A"}</span>
                </div>

                <div className="payment-row">
                  <span>User</span>
                  <span>
                    {payment.user
                      ? `${payment.user.name} (${payment.user.email})`
                      : "Unknown"}
                  </span>
                </div>

                <div className="payment-row">
                  <span>Method</span>
                  <span>{payment.method}</span>
                </div>

                <div className="payment-row">
                  <span>Status</span>
                  <span
                    className={`status ${payment.status?.toLowerCase()}`}
                  >
                    {payment.status}
                  </span>
                </div>

                <div className="payment-row total">
                  <span>Amount</span>
                  <span>${payment.amount}</span>
                </div>

                <div className="payment-row">
                  <span>Payment Date</span>
                  <span>
                    {payment.paymentDate
                      ? new Date(payment.paymentDate).toDateString()
                      : "N/A"}
                  </span>
                </div>

                {payment.status !== "Completed" && (
                  <button
                    className="primary-btn"
                    onClick={() => setConfirmPaymentId(payment._id)}
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
};

export default AllPayments;
