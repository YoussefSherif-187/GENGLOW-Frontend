import React, { useEffect, useState } from 'react';
import axios from 'axios';

import AdminSidebar from '../comp/AdminSidebar';
import Alerts from '../comp/Alerts';
import ConfirmModal from '../comp/ConfirmModal';

import "../pagesstyles/dashboard.css";
import "../adminstyles/allusers.css";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUsers();
  }, []);

  const showAlert = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setTimeout(() => {
      setAlertType(null);
      setAlertMessage('');
    }, 3000);
  };

  // =============================
  // FETCH USERS
  // =============================
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        'https://genglow-backend.vercel.app/api/admins/users',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err.response?.data || err.message);
      showAlert('error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // CREATE USER (FIXED)
  // =============================
  const handleCreateUser = async () => {
    try {
      const body = new URLSearchParams();
      body.append('name', newUser.name);
      body.append('email', newUser.email);
      body.append('password', newUser.password);
      body.append('role', newUser.role);

      await axios.post(
        'https://genglow-backend.vercel.app/api/admins/create-user',
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      showAlert('success', 'User created successfully');

      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'user'
      });

      fetchUsers();
    } catch (err) {
      console.error(err.response?.data || err.message);
      showAlert('error', 'Failed to create user');
    }
  };

  // =============================
  // UPDATE ROLE
  // =============================
  const handleRoleChange = async (userId, role) => {
    try {
      const body = new URLSearchParams();
      body.append('userId', userId);
      body.append('role', role);

      await axios.put(
        'https://genglow-backend.vercel.app/api/admins/update-role',
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      showAlert('success', 'User role updated');
      fetchUsers();
    } catch {
      showAlert('error', 'Failed to update role');
    }
  };

  // =============================
  // DELETE USER
  // =============================
  const handleDeleteUser = async () => {
    try {
      await axios.delete(
        `https://genglow-backend.vercel.app/api/admins/users/${confirmDeleteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showAlert('success', 'User deleted successfully');
      setConfirmDeleteId(null);
      fetchUsers();
    } catch {
      showAlert('error', 'Failed to delete user');
    }
  };

  return (
    <div className="layout">
      <AdminSidebar />

      <main className="main-content all-users">
        {/* ALERTS */}
        {alertType && <Alerts type={alertType} message={alertMessage} />}

        {/* CONFIRM DELETE */}
        <ConfirmModal
          show={!!confirmDeleteId}
          message="Are you sure you want to delete this user? This action cannot be undone."
          confirmText="Yes, Delete User"
          cancelText="Cancel"
          onCancel={() => setConfirmDeleteId(null)}
          onConfirm={handleDeleteUser}
        />

        {loading ? (
          <div className="loading-state">Loading users...</div>
        ) : (
          <>
            <h2 className="page-title">All Users</h2>

            {/* CREATE USER */}
            <div className="card">
              <h3 className="card-title">Create New User</h3>

              <div className="form-grid">
                <input
                  className="form-input"
                  placeholder="Full Name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                />

                <input
                  className="form-input"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />

                <input
                  className="form-input"
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />

                <select
                  className="form-input"
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="pharmacist">Pharmacist</option>
                </select>
              </div>

              <button className="primary-btn" onClick={handleCreateUser}>
                Create User
              </button>
            </div>

            {/* USERS TABLE */}
            <div className="card">
              <h3 className="card-title">Users List</h3>

              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Verified</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="pharmacist">Pharmacist</option>
                        </select>
                      </td>
                      <td>{user.isVerified ? 'Yes' : 'No'}</td>
                      <td>
                        <button
                          className="danger-btn"
                          onClick={() => setConfirmDeleteId(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AllUsers;
