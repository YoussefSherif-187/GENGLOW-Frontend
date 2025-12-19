import React, { useEffect, useState } from "react";
import axios from "axios";

import AdminSidebar from "../comp/AdminSidebar";
import Alerts from "../comp/Alerts";
import ConfirmModal from '../comp/ConfirmModal';

import "../pagesstyles/dashboard.css";
import "../adminstyles/allquizresults.css";

const AllQuizResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await axios.get(
        "https://genglow-backend.vercel.app/api/quizResults",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResults(Array.isArray(res.data) ? res.data : []);
    } catch {
      showAlert("error", "Failed to load quiz results");
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

  const deleteResult = async (id) => {
    try {
      await axios.delete(
        `https://genglow-backend.vercel.app/api/quizResults/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResults((prev) => prev.filter((r) => r._id !== id));
      setConfirmDeleteId(null);
      showAlert("success", "Quiz result deleted successfully");
    } catch {
      showAlert("error", "Failed to delete quiz result");
    }
  };

  return (
    <div className="layout">
      <AdminSidebar />

      <main className="main-content all-quiz-results">
        {alertType && <Alerts type={alertType} message={alertMessage} />}

        {/* CONFIRM DELETE */}
       <ConfirmModal
  show={!!confirmDeleteId}
  message="Are you sure you want to delete this quiz result? This action cannot be undone."
  confirmText="Yes, Delete Result"
  cancelText="Cancel"
  onCancel={() => setConfirmDeleteId(null)}
  onConfirm={() => deleteResult(confirmDeleteId)}
/>

        {/* CONTENT */}
        {loading ? (
          <div className="loading-state">Loading quiz results...</div>
        ) : results.length === 0 ? (
          <div className="empty-state">No quiz results found</div>
        ) : (
          <>
            <h2 className="page-title">All Quiz Results</h2>

            {results.map((result) => (
              <div className="card" key={result._id}>
                <h3 className="card-title">Quiz Result</h3>

                <div className="quiz-row">
                  <span>User</span>
                  <span>
                    {result.user?.name} ({result.user?.email})
                  </span>
                </div>

                <div className="quiz-row">
                  <span>Skin Type</span>
                  <span>{result.skinType}</span>
                </div>

                <div className="quiz-row">
                  <span>Hair Type</span>
                  <span>{result.hairType}</span>
                </div>

                <div className="quiz-row">
                  <span>Skin Concerns</span>
                  <span>{result.skinConcerns?.join(", ") || "—"}</span>
                </div>

                <div className="quiz-row">
                  <span>Hair Concerns</span>
                  <span>{result.hairConcerns?.join(", ") || "—"}</span>
                </div>

                <div className="quiz-row">
                  <span>Sleep Hours</span>
                  <span>{result.sleepHours}</span>
                </div>

                <div className="quiz-row">
                  <span>Pollution Exposure</span>
                  <span>{result.pollutionExposure}</span>
                </div>

                <div className="quiz-row">
                  <span>Diet</span>
                  <span>{result.diet}</span>
                </div>

                <div className="quiz-row">
                  <span>Goals</span>
                  <span>{result.goals?.join(", ") || "—"}</span>
                </div>

                <button
                  className="danger-btn"
                  onClick={() => setConfirmDeleteId(result._id)}
                >
                  Delete Quiz Result
                </button>
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
};

export default AllQuizResults;
