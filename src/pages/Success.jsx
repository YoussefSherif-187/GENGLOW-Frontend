import { useEffect, useContext, useState } from "react";
import { CartContext } from "../cart/CartContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../pagesstyles/success.css";

function Success() {
  const { clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================
     FETCH ORDER
  ===================== */
  useEffect(() => {
    if (!orderId) {
      setError("Order ID not found");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `https://genglow-backend.vercel.app/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrder(res.data);
        clearCart(); // ✅ clear cart only after order is confirmed
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load order details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, clearCart]);

  /* =====================
     STATES
  ===================== */
  if (loading) {
    return (
      <div className="success-page">
        <p>Loading your order...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="success-page">
        <p className="error">{error}</p>
        <button onClick={() => navigate("/")}>
          Back to Shop
        </button>
      </div>
    );
  }

  const total = order.products.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="success-page">
      <div className="success-box">
        <div className="success-icon">✓</div>

        <h1>Thank You for Your Order!</h1>

        <p>
          Your order has been placed successfully.
          We will contact you shortly to confirm delivery.
        </p>

        <div className="order-info">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Payment:</strong> Cash on Delivery</p>
          <p><strong>Total:</strong> EGP {total}</p>
        </div>

        <div className="order-items">
          <h3>Items</h3>

          {order.products.map((item) => (
            <div
              className="order-item"
              key={item.product._id}
            >
              <span>{item.product.name}</span>
              <span>x{item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="success-actions">
          <button onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default Success;
