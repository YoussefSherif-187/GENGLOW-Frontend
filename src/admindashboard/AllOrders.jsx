import React, { useEffect, useState } from "react";
import axios from "axios";

import AdminSidebar from "../comp/AdminSidebar";
import Alerts from "../comp/Alerts";
import ConfirmModal from "../comp/ConfirmModal";

import "../pagesstyles/dashboard.css";
import "../adminstyles/allorders.css";

const AllOrders = () => {
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const [deleteOrderId, setDeleteOrderId] = useState(null);

  const [editOrder, setEditOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [shippingPartner, setShippingPartner] = useState("");

  useEffect(() => {
    fetchOrders();
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
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "https://genglow-backend.vercel.app/api/admins/orders",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch {
      showAlert("error", "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDeleteOrder = async () => {
    try {
      await axios.delete(
        `https://genglow-backend.vercel.app/api/admins/orders/${deleteOrderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showAlert("success", "Order deleted successfully");
      setDeleteOrderId(null);
      fetchOrders();
    } catch {
      showAlert("error", "Failed to delete order");
    }
  };

  // ================= UPDATE =================
  const handleUpdateOrder = async () => {
    try {
      await axios.put(
        `https://genglow-backend.vercel.app/api/orders/${editOrder._id}`,
        new URLSearchParams({
          status,
          shippingPartner
        }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      );

      showAlert("success", "Order updated successfully");
      setEditOrder(null);
      fetchOrders();
    } catch {
      showAlert("error", "Failed to update order");
    }
  };

  return (
    <div className="layout">
      <AdminSidebar />

      <main className="main-content all-orders">
        {alertType && <Alerts type={alertType} message={alertMessage} />}

        <ConfirmModal
          show={!!deleteOrderId}
          message="Are you sure you want to delete this order?"
          confirmText="Yes, Delete Order"
          cancelText="Cancel"
          onCancel={() => setDeleteOrderId(null)}
          onConfirm={handleDeleteOrder}
        />

        {loading ? (
          <div className="loading-state">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="empty-state">No orders found</div>
        ) : (
          <>
            <h2 className="page-title">All Orders</h2>

            {orders.map(order => (
  <div key={order._id}>
    {/* ORDER CARD */}
    <div className="card">
      <h3 className="card-title">Order Summary</h3>

      <div className="order-row">
        <span>Order ID</span>
        <span>{order._id}</span>
      </div>

      <div className="order-row">
        <span>User</span>
        <span>
          {order.user
            ? `${order.user.name} (${order.user.email})`
            : "Guest"}
        </span>
      </div>

      <div className="order-row">
        <span>Status</span>
        <span className={`status ${order.status?.toLowerCase()}`}>
          {order.status}
        </span>
      </div>

      <div className="order-row">
        <span>Payment</span>
        <span>{order.paymentStatus}</span>
      </div>

      <div className="order-row total">
        <span>Total</span>
        <span>${order.totalPrice}</span>
      </div>

      <div className="order-products">
        <strong>Products</strong>

        {order.products.map((item, index) => (
          <div className="product-row" key={index}>
            <span>
              {item.product ? item.product.name : "Product unavailable"}
            </span>
            <span>Qty: {item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="admin-actions">
        <button
          className="secondary-btn"
          onClick={() => {
            setEditOrder(order);
            setStatus(order.status || "");
            setShippingPartner(order.shippingPartner?._id || "");
          }}
        >
          Update Order
        </button>

        <button
          className="danger-btn"
          onClick={() => setDeleteOrderId(order._id)}
        >
          Delete Order
        </button>
      </div>
    </div>

    {editOrder?._id === order._id && (
      <div className="card danger" style={{ marginTop: "10px" }}>
        <h3 className="card-title">Update Order</h3>

        <label className="form-label">Status</label>
        <select
          className="form-input"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="">Select status</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <label className="form-label">Shipping Partner ID</label>
        <input
          className="form-input"
          placeholder="Shipping Partner ID"
          value={shippingPartner}
          onChange={e => setShippingPartner(e.target.value)}
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="primary-btn" onClick={handleUpdateOrder}>
            Save Changes
          </button>
          <button
            className="secondary-btn"
            onClick={() => setEditOrder(null)}
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

export default AllOrders;
