import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../pagesstyles/checkout.css";

function Checkout() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);

  /* =====================
     PRODUCT IMAGE HELPER
  ===================== */
  const getProductImage = (prodId) => {
    try {
      return require(`../assets/products/${prodId}.png`);
    } catch (err) {
      return require(`../assets/products/prod1.png`);
    }
  };

  /* =====================
     FETCH ORDER
  ===================== */
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
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
      } catch (err) {
        alert("Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  /* =====================
     CHECKOUT (PAYMENT)
  ===================== */
  const handlePayment = async () => {
    try {
      setPaying(true);
      const token = localStorage.getItem("token");

      const formBody = new URLSearchParams();
      formBody.append("orderId", orderId);

      await axios.post(
        "https://genglow-backend.vercel.app/api/payments/checkout",
        formBody,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/success/${orderId}`);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Payment failed. Please try again.";
      alert(message);
    } finally {
      setPaying(false);
    }
  };

  if (loading || !order) {
    return <p style={{ textAlign: "center" }}>Loading checkout...</p>;
  }

  const subtotal = order.products.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="checkout-page">
      <div className="checkout-wrapper">
        {/* LEFT */}
        <div className="checkout-left">
          <h1>Checkout</h1>

          <div className="section">
            <h3>Payment Method</h3>

            <label className="payment-option">
              <input type="radio" checked readOnly />
              Cash on Delivery
            </label>
          </div>

          <button
            className="pay-btn"
            disabled={paying}
            onClick={handlePayment}
          >
            {paying ? "Processing..." : "Confirm Order"}
          </button>
        </div>

        {/* RIGHT */}
        <div className="checkout-right">
          <h3>Order Summary</h3>

          {order.products.map((item) => (
            <div
              className="summary-item"
              key={item.product._id}
            >
              <img
                src={getProductImage(item.product._id)}
                alt={item.product.name}
              />

              <div>
                <p>{item.product.name}</p>
                <small>Qty: {item.quantity}</small>
              </div>

              <strong>
                EGP {item.product.price * item.quantity}
              </strong>
            </div>
          ))}

          <div className="summary-row">
            <span>Subtotal</span>
            <span>EGP {subtotal}</span>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>EGP {subtotal}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
