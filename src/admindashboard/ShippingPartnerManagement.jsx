import React, { useEffect, useState } from "react";
import axios from "axios";

import AdminSidebar from "../comp/AdminSidebar";
import Alerts from "../comp/Alerts";
import ConfirmModal from '../comp/ConfirmModal';

import "../pagesstyles/dashboard.css";
import "../adminstyles/shippingpartners.css";

const ShippingPartnerManagement = () => {
  const token = localStorage.getItem("token");

  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const [newPartner, setNewPartner] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [editingPartner, setEditingPartner] = useState(null);

  // ✅ SAME confirm delete pattern as SupplierManagement
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

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
  const fetchPartners = async () => {
    try {
      const res = await axios.get(
        "https://genglow-backend.vercel.app/api/shipping-partners",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPartners(res.data || []);
    } catch {
      showAlert("error", "Failed to load shipping partners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  /* ================= CREATE ================= */
  const handleCreate = async () => {
    try {
      await axios.post(
        "https://genglow-backend.vercel.app/api/shipping-partners",
        new URLSearchParams(newPartner),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      showAlert("success", "Shipping partner created");
      setNewPartner({ name: "", phone: "", address: "" });
      fetchPartners();
    } catch {
      showAlert("error", "Failed to create shipping partner");
    }
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    try {
      await axios.put(
        `https://genglow-backend.vercel.app/api/shipping-partners/${editingPartner._id}`,
        new URLSearchParams({
          name: editingPartner.name,
          phone: editingPartner.phone,
          address: editingPartner.address,
        }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      showAlert("success", "Shipping partner updated");
      setEditingPartner(null);
      fetchPartners();
    } catch {
      showAlert("error", "Failed to update shipping partner");
    }
  };

  /* ================= DELETE ================= */
  const deletePartner = async (id) => {
    try {
      await axios.delete(
        `https://genglow-backend.vercel.app/api/shipping-partners/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPartners((prev) => prev.filter((p) => p._id !== id));
      setConfirmDeleteId(null);
      showAlert("success", "Shipping partner deleted");
    } catch {
      showAlert("error", "Failed to delete shipping partner");
    }
  };

  return (
    <div className="layout">
      <AdminSidebar />

      <main className="main-content shipping-partners">
        {alertType && <Alerts type={alertType} message={alertMessage} />}

        <ConfirmModal
  show={!!confirmDeleteId}
  message="Are you sure you want to delete this shipping partner? This action cannot be undone."
  confirmText="Yes, Delete Partner"
  cancelText="Cancel"
  onCancel={() => setConfirmDeleteId(null)}
  onConfirm={() => deletePartner(confirmDeleteId)}
/>


        <h2 className="page-title">Shipping Partners</h2>

        {/* CREATE */}
        <div className="card">
          <h3 className="card-title">Add New Shipping Partner</h3>

          <input
            className="form-input"
            placeholder="Name"
            value={newPartner.name}
            onChange={(e) =>
              setNewPartner({ ...newPartner, name: e.target.value })
            }
          />

          <input
            className="form-input"
            placeholder="Phone"
            value={newPartner.phone}
            onChange={(e) =>
              setNewPartner({ ...newPartner, phone: e.target.value })
            }
          />

          <input
            className="form-input"
            placeholder="Address"
            value={newPartner.address}
            onChange={(e) =>
              setNewPartner({ ...newPartner, address: e.target.value })
            }
          />

          <button className="primary-btn" onClick={handleCreate}>
            Create Partner
          </button>
        </div>

        

      {loading ? (
  <div className="loading-state">Loading partners...</div>
) : partners.length === 0 ? (
  <div className="empty-state">No shipping partners found</div>
) : (
  partners.map((partner) => (
    <div key={partner._id}>
      {/* PARTNER CARD */}
      <div className="card">
        <strong>{partner.name}</strong>

        <div className="row">
          <span>Phone</span>
          <span>{partner.phone}</span>
        </div>

        <div className="row">
          <span>Address</span>
          <span>{partner.address}</span>
        </div>

        <div className="actions-row">
          <button
            className="secondary-btn"
            onClick={() => setEditingPartner({ ...partner })}
          >
            Edit
          </button>

          <button
            className="danger-btn"
            onClick={() => setConfirmDeleteId(partner._id)}
          >
            Delete
          </button>
        </div>
      </div>

      {/* EDIT FORM — ONLY UNDER CLICKED PARTNER */}
      {editingPartner?._id === partner._id && (
        <div className="card" style={{ marginTop: "10px" }}>
          <h3 className="card-title">Update Shipping Partner</h3>

          <input
            className="form-input"
            value={editingPartner.name}
            onChange={(e) =>
              setEditingPartner({
                ...editingPartner,
                name: e.target.value,
              })
            }
          />

          <input
            className="form-input"
            value={editingPartner.phone}
            onChange={(e) =>
              setEditingPartner({
                ...editingPartner,
                phone: e.target.value,
              })
            }
          />

          <input
            className="form-input"
            value={editingPartner.address}
            onChange={(e) =>
              setEditingPartner({
                ...editingPartner,
                address: e.target.value,
              })
            }
          />

          <div className="actions-row">
            <button className="primary-btn" onClick={handleUpdate}>
              Save Changes
            </button>

            <button
              className="secondary-btn"
              onClick={() => setEditingPartner(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  ))
)}

      </main>
    </div>
  );
};

export default ShippingPartnerManagement;
