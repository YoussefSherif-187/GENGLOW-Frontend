import React, { useEffect, useState } from 'react';
import axios from 'axios';

import UserSidebar from '../comp/Usersidebar';
import Alerts from '../comp/Alerts';

import "../pagesstyles/dashboard.css";
import "../userstyles/samples.css";

const Samples = () => {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const res = await axios.get(
          'https://genglow-backend.vercel.app/api/samplerequests/my',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setSamples(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err.response?.data || err.message);
        showAlert('error', 'Failed to load sample requests');
      } finally {
        setLoading(false);
      }
    };

    fetchSamples();
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

      <main className="main-content samples-page">
        {alertType && <Alerts type={alertType} message={alertMessage} />}

        {loading ? (
          <div className="loading-state">Loading sample requests...</div>
        ) : samples.length === 0 ? (
          <div className="empty-state">No sample requests found</div>
        ) : (
          <>
            <h2 className="page-title">My Sample Requests</h2>

            {samples.map(sample => (
              <div className="card" key={sample._id}>
                <h3 className="card-title">Sample Request</h3>

                <div className="sample-row">
                  <span>Request ID</span>
                  <span>{sample._id}</span>
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
                  <span className={`status ${sample.status.toLowerCase()}`}>
                    {sample.status}
                  </span>
                </div>

                <div className="sample-row">
                  <span>Requested On</span>
                  <span>
                    {new Date(sample.createdAt).toDateString()}
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

export default Samples;
