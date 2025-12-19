import React, { useEffect, useState } from "react";
import axios from "axios";

import PharmacistSidebar from "../comp/PharmacistSidebar";
import Alerts from "../comp/Alerts";
import ConfirmModal2 from "../comp/ConfirmModal2";

import "../pagesstyles/dashboard.css";

const PharmacistApprovedSamples = () => {
  const token = localStorage.getItem("token");

  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);

  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const [confirmUpdateId, setConfirmUpdateId] = useState(null);

  /* ================= ALERT ================= */
  const showAlert = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setTimeout(() => {
      setAlertType(null);
      setAlertMessage("");
    }, 3000);
  };

  /* ================= FETCH ================= */
  const fetchSamples = async () => {
    try {
      const res = await axios.get(
        "https://genglow-backend.vercel.app/api/pharmacists/samples",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSamples(Array.isArray(res.data) ? res.data : []);
    } catch {
      showAlert("error", "Failed to load sample requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSamples();
  }, []);

  /* ================= UPDATE STATUS ================= */
  const markAsShipped = async (id) => {
    try {
      await axios.put(
        `https://genglow-backend.vercel.app/api/pharmacists/samples/${id}`,
        new URLSearchParams({ status: "Shipped" }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      showAlert("success", "Sample marked as shipped");
      setConfirmUpdateId(null);
      fetchSamples();
    } catch {
      showAlert("error", "Failed to update sample status");
    }
  };

  return (
    <div className="layout">
      <PharmacistSidebar />

      <main className="main-content samples">
        {alertType && <Alerts type={alertType} message={alertMessage} />}

        {/* CONFIRM STATUS UPDATE */}
        <ConfirmModal2
          show={!!confirmUpdateId}
          message="Mark this sample request as shipped?"
          confirmText="Yes, Mark as Shipped"
          cancelText="Cancel"
          onCancel={() => setConfirmUpdateId(null)}
          onConfirm={() => markAsShipped(confirmUpdateId)}
        />

        <h2 className="page-title">Approved Sample Requests</h2>

        {/* LIST */}
        {loading ? (
          <div className="loading-state">Loading samples...</div>
        ) : samples.length === 0 ? (
          <div className="empty-state">No approved samples found</div>
        ) : (
          samples.map((sample) => (
            <div className="card" key={sample._id}>
              <h3 className="card-title">Sample Request</h3>

              <div className="row">
                <span>User</span>
                <span>
                  {sample.user?.name
                    ? `${sample.user.name} (${sample.user.email})`
                    : "Guest User"}
                </span>
              </div>

              <div className="row">
                <span>Product</span>
                <span>{sample.product?.name}</span>
              </div>

              <div className="row">
                <span>Status</span>
                <span className={`status ${sample.status?.toLowerCase()}`}>
                  {sample.status}
                </span>
              </div>

              <div className="row">
                <span>Requested At</span>
                <span>
                  {new Date(sample.createdAt).toLocaleDateString()}
                </span>
              </div>
<br/>
              {sample.status === "Approved" && (
                <button
                  className="primary-btn"
                  onClick={() => setConfirmUpdateId(sample._id)}
                >
                  Mark as Shipped
                </button>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default PharmacistApprovedSamples;
