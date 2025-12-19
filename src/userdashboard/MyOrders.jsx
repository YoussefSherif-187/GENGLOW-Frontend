import React, { useEffect, useState } from 'react';
import axios from 'axios';

import ConfirmModal from '../comp/ConfirmModal';
import UserSidebar from '../comp/Usersidebar';
import Alerts from '../comp/Alerts';

import "../pagesstyles/dashboard.css";
import "../userstyles/myorders.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  const [confirmOrderId, setConfirmOrderId] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        'https://genglow-backend.vercel.app/api/orders/myorders',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err.response?.data || err.message);
      showAlert('error', 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setTimeout(() => {
      setAlertType(null);
      setAlertMessage('');
    }, 3000);
  };

  const cancelOrder = async (orderId) => {
    try {
      await axios.patch(
        `https://genglow-backend.vercel.app/api/orders/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders(prev =>
        prev.map(order =>
          order._id === orderId
            ? { ...order, status: 'Cancelled' }
            : order
        )
      );

      setConfirmOrderId(null);
      showAlert('success', 'Order cancelled successfully');
    } catch (err) {
      console.error(err.response?.data || err.message);
      showAlert('error', 'Failed to cancel order');
    }
  };

  return (
    <div className="layout">
      <UserSidebar />

      <main className="main-content my-orders">
        {/* ALERTS */}
        {alertType && <Alerts type={alertType} message={alertMessage} />}

        {/* CONFIRM CANCEL MODAL */}
        <ConfirmModal
          show={!!confirmOrderId}
          message="Are you sure you want to cancel this order?"
          confirmText="Yes, Cancel My Order"
          cancelText="No, Keep My Order"
          onCancel={() => setConfirmOrderId(null)}
          onConfirm={() => cancelOrder(confirmOrderId)}
        />

        {/* CONTENT */}
        {loading ? (
          <div className="loading-state">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="empty-state">No orders found</div>
        ) : (
          <>
            <h2 className="page-title">My Orders</h2>

            {orders.map(order => (
              <div className="card" key={order._id}>
                <h3 className="card-title">Order Summary</h3>

                <div className="order-row">
                  <span>Order ID</span>
                  <span>{order._id}</span>
                </div>

                <div className="order-row">
                  <span>Date</span>
                  <span>{new Date(order.createdAt).toDateString()}</span>
                </div>

                <div className="order-row">
                  <span>Status</span>
                  <span className={`status ${order.status.toLowerCase()}`}>
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
                        {item.product
                          ? item.product.name
                          : 'Product unavailable'}
                      </span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  ))}
                </div>

                {order.status !== 'Cancelled' &&
                 order.status !== 'Completed' && (
                  <button
                    className="danger-btn"
                    onClick={() => setConfirmOrderId(order._id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
};

export default MyOrders;
