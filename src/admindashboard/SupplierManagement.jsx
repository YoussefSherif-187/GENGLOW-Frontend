import React, { useEffect, useState } from "react";
import axios from "axios";

import AdminSidebar from "../comp/AdminSidebar";
import Alerts from "../comp/Alerts";
import ConfirmModal from "../comp/ConfirmModal";

import "../pagesstyles/dashboard.css";
import "../adminstyles/suppliers.css";

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  /* CREATE FORM */
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  /* UPDATE FORM (NOW INCLUDES NAME) */
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(
        "https://genglow-backend.vercel.app/api/suppliers",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuppliers(Array.isArray(res.data) ? res.data : []);
    } catch {
      showAlert("error", "Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setTimeout(() => {
      setAlertType(null);
      setAlertMessage("");
    }, 3000);
  };

  /* CREATE SUPPLIER */
  const createSupplier = async () => {
    try {
      await axios.post(
        "https://genglow-backend.vercel.app/api/suppliers",
        new URLSearchParams(createForm),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      );

      showAlert("success", "Supplier created successfully");
      setCreateForm({
        name: "",
        email: "",
        phone: "",
        address: ""
      });
      fetchSuppliers();
    } catch {
      showAlert("error", "Failed to create supplier");
    }
  };

  /* START EDIT */
  const startEdit = (supplier) => {
    setEditingSupplier(supplier);
    setUpdateForm({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address
    });
  };

  /* UPDATE SUPPLIER */
  const updateSupplier = async () => {
    try {
      await axios.put(
        `https://genglow-backend.vercel.app/api/suppliers/${editingSupplier._id}`,
        new URLSearchParams(updateForm),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      );

      showAlert("success", "Supplier updated successfully");
      setEditingSupplier(null);
      fetchSuppliers();
    } catch {
      showAlert("error", "Failed to update supplier");
    }
  };

  /* DELETE SUPPLIER */
  const deleteSupplier = async (id) => {
    try {
      await axios.delete(
        `https://genglow-backend.vercel.app/api/suppliers/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuppliers((prev) => prev.filter((s) => s._id !== id));
      setConfirmDeleteId(null);
      showAlert("success", "Supplier deleted successfully");
    } catch {
      showAlert("error", "Failed to delete supplier");
    }
  };

  return (
    <div className="layout">
      <AdminSidebar />

      <main className="main-content suppliers">
        {alertType && <Alerts type={alertType} message={alertMessage} />}

        <ConfirmModal
          show={!!confirmDeleteId}
          message="Are you sure you want to delete this supplier? This action cannot be undone."
          confirmText="Yes, Delete Supplier"
          cancelText="Cancel"
          onCancel={() => setConfirmDeleteId(null)}
          onConfirm={() => deleteSupplier(confirmDeleteId)}
        />

        <h2 className="page-title">Supplier Management</h2>

        {/* CREATE SUPPLIER */}
        <div className="card">
          <h3 className="card-title">Create New Supplier</h3>

          

          <input
            className="form-input"
            placeholder="Name"
            value={createForm.name}
            onChange={(e) =>
              setCreateForm({ ...createForm, name: e.target.value })
            }
          />

          <input
            className="form-input"
            placeholder="Email"
            value={createForm.email}
            onChange={(e) =>
              setCreateForm({ ...createForm, email: e.target.value })
            }
          />

          <input
            className="form-input"
            placeholder="Phone"
            value={createForm.phone}
            onChange={(e) =>
              setCreateForm({ ...createForm, phone: e.target.value })
            }
          />

          <input
            className="form-input"
            placeholder="Address"
            value={createForm.address}
            onChange={(e) =>
              setCreateForm({ ...createForm, address: e.target.value })
            }
          />

          <button className="primary-btn" onClick={createSupplier}>
            Create Supplier
          </button>
        </div>

      

       {loading ? (
  <div className="loading-state">Loading suppliers...</div>
) : suppliers.length === 0 ? (
  <div className="empty-state">No suppliers found</div>
) : (
  suppliers.map((supplier) => (
    <div key={supplier._id}>
      {/* SUPPLIER CARD */}
      <div className="card">
        <h3 className="card-title">{supplier.name}</h3>

        <div className="supplier-row">
          <span>ID</span>
          <span className="supplier-id">{supplier._id}</span>
        </div>

        <div className="supplier-row">
          <span>Email</span>
          <span>{supplier.email}</span>
        </div>

        <div className="supplier-row">
          <span>Phone</span>
          <span>{supplier.phone}</span>
        </div>

        <div className="supplier-row">
          <span>Address</span>
          <span>{supplier.address}</span>
        </div>

        <div className="btn-row">
          <button
            className="secondary-btn"
            onClick={() => startEdit(supplier)}
          >
            Edit
          </button>

          <button
            className="danger-btn"
            onClick={() => setConfirmDeleteId(supplier._id)}
          >
            Delete
          </button>
        </div>
      </div>

      {/* EDIT FORM — ONLY UNDER CLICKED SUPPLIER */}
      {editingSupplier?._id === supplier._id && (
        <div className="card" style={{ marginTop: "10px" }}>
          <h3 className="card-title">
            Update Supplier — {updateForm.name}
          </h3>

          <input
            className="form-input"
            placeholder="Name"
            value={updateForm.name}
            onChange={(e) =>
              setUpdateForm({ ...updateForm, name: e.target.value })
            }
          />

          <input
            className="form-input"
            placeholder="Email"
            value={updateForm.email}
            onChange={(e) =>
              setUpdateForm({ ...updateForm, email: e.target.value })
            }
          />

          <input
            className="form-input"
            placeholder="Phone"
            value={updateForm.phone}
            onChange={(e) =>
              setUpdateForm({ ...updateForm, phone: e.target.value })
            }
          />

          <input
            className="form-input"
            placeholder="Address"
            value={updateForm.address}
            onChange={(e) =>
              setUpdateForm({ ...updateForm, address: e.target.value })
            }
          />

          <div className="btn-row">
            <button className="primary-btn" onClick={updateSupplier}>
              Update Supplier
            </button>

            <button
              className="secondary-btn"
              onClick={() => setEditingSupplier(null)}
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

export default SupplierManagement;
