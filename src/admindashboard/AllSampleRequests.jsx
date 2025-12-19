import React, { useEffect, useState } from "react";
import axios from "axios";

import AdminSidebar from "../comp/AdminSidebar";
import Alerts from "../comp/Alerts";
import ConfirmModal from "../comp/ConfirmModal";

import "../pagesstyles/dashboard.css";
import "../adminstyles/allsamplerequests.css";

const AllSampleRequests = () => {
  const token = localStorage.getItem("token");

  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);

  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const [editSample, setEditSample] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const [confirmUpdate, setConfirmUpdate] = useState(false);

  useEffect(() => {
    fetchSamples();
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
  const fetchSamples = async () => {
    try {
      const res = await axios.get(
        "https://genglow-backend.vercel.app/api/admins/samples",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSamples(Array.isArray(res.data) ? res.data : []);
    } catch {
      showAlert("error", "Failed to load sample requests");
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE =================
  const handleUpdateSample = async () => {
    try {
      await axios.put(
        `https://genglow-backend.vercel.app/api/admins/samples/${editSample._id}`,
        new URLSearchParams({ status: newStatus }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      );

      showAlert("success", "Sample request updated successfully");
      setEditSample(null);
      setConfirmUpdate(false);
      fetchSamples();
    } catch {
      showAlert("error", "Failed to update sample request");
    }
  };

  return (
    <div className="layout">
      <AdminSidebar />

      <main className="main-content all-sample-requests">
        {alertType && <Alerts type={alertType} message={alertMessage} />}

        <ConfirmModal
          show={confirmUpdate}
          message="Are you sure you want to update this sample request?"
          confirmText="Yes, Update"
          cancelText="Cancel"
          onCancel={() => setConfirmUpdate(false)}
          onConfirm={handleUpdateSample}
        />

        {loading ? (
          <div className="loading-state">Loading sample requests...</div>
        ) : samples.length === 0 ? (
          <div className="empty-state">No sample requests found</div>
        ) : (
          <>
            <h2 className="page-title">All Sample Requests</h2>

           {samples.map(sample => (
  <div key={sample._id}>
    {/* SAMPLE CARD */}
    <div className="card">
      <h3 className="card-title">Sample Request</h3>

      <div className="sample-row">
        <span>Request ID</span>
        <span>{sample._id}</span>
      </div>

      <div className="sample-row">
        <span>User</span>
        <span>
          {sample.user
            ? `${sample.user.name} (${sample.user.email})`
            : "Guest"}
        </span>
      </div>

      <div className="sample-row">
        <span>Product</span>
        <span>{sample.product?.name}</span>
      </div>

      <div className="sample-row">
        <span>Price</span>
        <span>${sample.product?.price}</span>
      </div>

      <div className="sample-row">
        <span>Status</span>
        <span className={`status ${sample.status?.toLowerCase()}`}>
          {sample.status}
        </span>
      </div>

      <div className="sample-row">
        <span>Requested On</span>
        <span>{new Date(sample.createdAt).toDateString()}</span>
      </div>

      <div className="admin-actions">
        <button
          className="secondary-btn"
          onClick={() => {
            setEditSample(sample);
            setNewStatus(sample.status);
          }}
        >
          Update Status
        </button>
      </div>
    </div>

    {/* UPDATE PANEL — ONLY UNDER CLICKED SAMPLE */}
    {editSample?._id === sample._id && (
      <div className="card danger" style={{ marginTop: "10px" }}>
        <h3 className="card-title">Update Sample Status</h3>

        <label className="form-label">Status</label>
        <select
          className="form-input"
          value={newStatus}
          onChange={e => setNewStatus(e.target.value)}
        >
          <option value="">Select status</option>
          <option value="Approved">Approved</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Shipped">Shipped</option>
        </select>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="primary-btn"
            onClick={() => setConfirmUpdate(true)}
          >
            Save Changes
          </button>

          <button
            className="secondary-btn"
            onClick={() => {
              setEditSample(null);
              setConfirmUpdate(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    )}
  </div>
))}

          </>
        )}

      
      </main>
    </div>
  );
};

export default AllSampleRequests;
