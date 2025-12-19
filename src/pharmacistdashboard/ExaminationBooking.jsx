import React, { useEffect, useState } from "react";
import axios from "axios";

import PharmacistSidebar from "../comp/PharmacistSidebar";
import Alerts from "../comp/Alerts";

import "../pagesstyles/dashboard.css";

const PharmacistExaminations = () => {
  const token = localStorage.getItem("token");

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const [editingExam, setEditingExam] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    status: "",
    notes: "",
  });

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
  const fetchExaminations = async () => {
    try {
      const res = await axios.get(
        "https://genglow-backend.vercel.app/api/pharmacists/examinations",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setExams(Array.isArray(res.data) ? res.data : []);
    } catch {
      showAlert("error", "Failed to load examinations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExaminations();
  }, []);

  /* ================= START UPDATE ================= */
  const startUpdate = (exam) => {
    setEditingExam(exam);
    setUpdateForm({
      status: exam.status || "",
      notes: exam.notes || "",
    });
  };

  /* ================= UPDATE ================= */
  const updateExamination = async () => {
    try {
      await axios.put(
        `https://genglow-backend.vercel.app/api/pharmacists/examinations/${editingExam._id}`,
        new URLSearchParams(updateForm),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      showAlert("success", "Examination updated successfully");
      setEditingExam(null);
      fetchExaminations();
    } catch {
      showAlert("error", "Failed to update examination");
    }
  };

  return (
    <div className="layout">
      <PharmacistSidebar />

      <main className="main-content pharmacist-examinations">
        {alertType && <Alerts type={alertType} message={alertMessage} />}

        <h2 className="page-title">Examination Bookings</h2>

       

       {loading ? (
  <div className="loading-state">Loading examinations...</div>
) : exams.length === 0 ? (
  <div className="empty-state">No examination bookings found</div>
) : (
  exams.map((exam) => (
    <div key={exam._id}>
      {/* EXAM CARD */}
      <div className="card">
        <h3 className="card-title">Examination</h3>

        <div className="row">
          <span>Customer</span>
          <span>
            {exam.customer?.name} ({exam.customer?.email})
          </span>
        </div>

        <div className="row">
          <span>Date</span>
          <span>{new Date(exam.date).toLocaleDateString()}</span>
        </div>

        <div className="row">
          <span>Status</span>
          <span>{exam.status}</span>
        </div>

        <div className="row">
          <span>Notes</span>
          <span>{exam.notes || "—"}</span>
        </div>

        <br />

        <div className="actions-row">
          <button
            className="secondary-btn"
            onClick={() => startUpdate(exam)}
          >
            Update
          </button>
        </div>
      </div>

      {/* EDIT FORM — ONLY UNDER CLICKED EXAM */}
      {editingExam?._id === exam._id && (
        <div className="card" style={{ marginTop: "10px" }}>
          <h3 className="card-title">
            Update Examination — {editingExam.customer?.name}
          </h3>

          <select
            className="form-input"
            value={updateForm.status}
            onChange={(e) =>
              setUpdateForm({ ...updateForm, status: e.target.value })
            }
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <textarea
            className="form-input"
            placeholder="Notes"
            value={updateForm.notes}
            onChange={(e) =>
              setUpdateForm({ ...updateForm, notes: e.target.value })
            }
          />

          <div className="actions-row">
            <button className="primary-btn" onClick={updateExamination}>
              Save Changes
            </button>

            <button
              className="secondary-btn"
              onClick={() => setEditingExam(null)}
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

export default PharmacistExaminations;
