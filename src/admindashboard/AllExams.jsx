import React, { useEffect, useState } from "react";
import axios from "axios";

import AdminSidebar from "../comp/AdminSidebar";
import Alerts from "../comp/Alerts";
import ConfirmModal from '../comp/ConfirmModal';

import "../pagesstyles/dashboard.css";
import "../adminstyles/allexams.css";

const AllExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await axios.get(
        "https://genglow-backend.vercel.app/api/admins/examinations",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setExams(Array.isArray(res.data) ? res.data : []);
    } catch {
      showAlert("error", "Failed to load examinations");
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

  const deleteExam = async (id) => {
    try {
      await axios.delete(
        `https://genglow-backend.vercel.app/api/admins/examinations/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setExams((prev) => prev.filter((exam) => exam._id !== id));
      setConfirmDeleteId(null);
      showAlert("success", "Examination deleted successfully");
    } catch {
      showAlert("error", "Failed to delete examination");
    }
  };

  return (
    <div className="layout">
      <AdminSidebar />

      <main className="main-content all-exams">
        {alertType && <Alerts type={alertType} message={alertMessage} />}

       <ConfirmModal
  show={!!confirmDeleteId}
  message="Are you sure you want to delete this examination? This action cannot be undone."
  confirmText="Yes, Delete Examination"
  cancelText="Cancel"
  onCancel={() => setConfirmDeleteId(null)}
  onConfirm={() => deleteExam(confirmDeleteId)}
/>


        {loading ? (
          <div className="loading-state">Loading examinations...</div>
        ) : exams.length === 0 ? (
          <div className="empty-state">No examinations found</div>
        ) : (
          <>
            <h2 className="page-title">All Examinations</h2>

            {exams.map((exam) => (
              <div className="card" key={exam._id}>
                <h3 className="card-title">Examination Details</h3>

                <div className="exam-row">
                  <span>Exam ID</span>
                  <span>{exam._id}</span>
                </div>

                <div className="exam-row">
                  <span>Customer</span>
                  <span>
                    {exam.customer?.name || "Unknown"} (
                    {exam.customer?.email || "N/A"})
                  </span>
                </div>

                <div className="exam-row">
                  <span>Date</span>
                  <span>{new Date(exam.date).toDateString()}</span>
                </div>

                <div className="exam-row">
                  <span>Status</span>
                  <span className={`status ${exam.status.toLowerCase()}`}>
                    {exam.status}
                  </span>
                </div>

                <div className="exam-row notes">
                  <span>Notes</span>
                  <span>{exam.notes || "—"}</span>
                </div>

                <button
                  className="danger-btn"
                  onClick={() => setConfirmDeleteId(exam._id)}
                >
                  Delete Examination
                </button>
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
};

export default AllExams;
