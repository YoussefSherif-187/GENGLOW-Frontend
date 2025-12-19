import React, { useEffect, useState } from 'react';
import axios from 'axios';

import ConfirmModal from '../comp/ConfirmModal';
import UserSidebar from '../comp/Usersidebar';
import Alerts from '../comp/Alerts';

import "../pagesstyles/dashboard.css";
import "../userstyles/userprofile.css";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  const [confirmDelete, setConfirmDelete] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(
      'https://genglow-backend.vercel.app/api/users/profile',
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(res => {
      setProfile(res.data);
      setName(res.data.name);
      setLoading(false);
    })
    .catch(() => {
      showAlert('error', 'Failed to load profile');
      setLoading(false);
    });
  }, []);

  const showAlert = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setTimeout(() => {
      setAlertType(null);
      setAlertMessage('');
    }, 3000);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        'https://genglow-backend.vercel.app/api/users/profile',
        new URLSearchParams({ name }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      showAlert('success', 'Profile updated successfully');
    } catch {
      showAlert('error', 'Failed to update profile');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        'https://genglow-backend.vercel.app/api/users/profile',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showAlert('success', 'Account deleted successfully');

      setTimeout(() => {
        localStorage.clear();
        window.location.href = '/home';
      }, 1500);
    } catch {
      showAlert('error', 'Failed to delete account');
    }
  };

  return (
    <div className="layout">
      <UserSidebar />

      <main className="main-content user-profile">
        {/* ALERTS */}
        {alertType && <Alerts type={alertType} message={alertMessage} />}

        {/* CONFIRM DELETE MODAL */}
        <ConfirmModal
          show={confirmDelete}
          message="Are you sure? This action cannot be undone."
          confirmText="Yes, Delete Account"
          cancelText="Cancel"
          onCancel={() => setConfirmDelete(false)}
          onConfirm={handleDelete}
        />

        {loading ? (
          <div className="loading-state">Loading profile...</div>
        ) : (
          <>
            <h2 className="page-title">User Profile</h2>

            <div className="card">
              <h3 className="card-title">Profile Information</h3>

              <div className="profile-row">
                <span>Name</span>
                <span>{profile.name}</span>
              </div>

              <div className="profile-row">
                <span>Email</span>
                <span>{profile.email}</span>
              </div>

              <div className="profile-row">
                <span>Email Verified</span>
                <span>{profile.isVerified ? 'Yes' : 'No'}</span>
              </div>

              <div className="profile-row">
                <span>Member Since</span>
                <span>{new Date(profile.createdAt).toDateString()}</span>
              </div>
            </div>

            {/* EDIT PROFILE */}
            <div className="card">
              <h3 className="card-title">Edit Profile</h3>

              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <button className="primary-btn" onClick={handleUpdate}>
                Save Changes
              </button>
            </div>

            {/* DANGER ZONE */}
            <div className="card danger">
              <h3 className="card-title danger-text">Danger Zone</h3>

              <button
                className="danger-btn"
                onClick={() => setConfirmDelete(true)}
              >
                Delete Account
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default UserProfile;
