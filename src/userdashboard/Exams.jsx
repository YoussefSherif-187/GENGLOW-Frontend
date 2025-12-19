import React, { useEffect, useState } from 'react';
import axios from 'axios';

import UserSidebar from '../comp/Usersidebar';
import Alerts from '../comp/Alerts';

import "../pagesstyles/dashboard.css";
import "../userstyles/exams.css";

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await axios.get(
          'https://genglow-backend.vercel.app/api/examinations',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setExams(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err.response?.data || err.message);
        showAlert('error', 'Failed to load examinations');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
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

      <main className="main-content exams-page">
        {alertType && <Alerts type={alertType} message={alertMessage} />}

        {loading ? (
          <div className="loading-state">Loading examinations...</div>
        ) : exams.length === 0 ? (
          <div className="empty-state">No examinations found</div>
        ) : (
          <>
            <h2 className="page-title">My Examinations</h2>

            {exams.map(exam => (
              <div className="card" key={exam._id}>
                <h3 className="card-title">Examination</h3>

                <div className="exam-row">
                  <span>Exam ID</span>
                  <span>{exam._id}</span>
                </div>

                <div className="exam-row">
                  <span>Exam Date</span>
                  <span>{new Date(exam.date).toDateString()}</span>
                </div>

                <div className="exam-row">
                  <span>Status</span>
                  <span className={`status ${exam.status.toLowerCase()}`}>
                    {exam.status}
                  </span>
                </div>

                <div className="exam-row">
                  <span>Notes</span>
                  <span>{exam.notes || '—'}</span>
                </div>

                <div className="exam-row">
                  <span>Booked On</span>
                  <span>{new Date(exam.createdAt).toDateString()}</span>
                </div>
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
};

export default Exams;
