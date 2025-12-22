import { useContext, useState } from "react";
import { CartContext } from "../cart/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Alerts from "../comp/Alerts";

import "../pagesstyles/checkout.css";

function Order() {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const [shipping, setShipping] = useState({
    fullName: "",
    phone: "",
    city: "",
    governorate: "",
  });

  const showAlert = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setTimeout(() => {
      setAlertType(null);
      setAlertMessage("");
    }, 3000);
  };

  const getProductImage = (prodId) => {
    try {
      return require(`../assets/products/${prodId}.png`);
    } catch {
      return require(`../assets/products/prod1.png`);
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setShipping({
      ...shipping,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateOrder = async () => {
    if (
      !shipping.fullName ||
      !shipping.phone ||
      !shipping.city ||
      !shipping.governorate
    ) {
      showAlert("error", "Please fill all shipping details");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const formBody = new URLSearchParams();

      cart.forEach((item, index) => {
        formBody.append(`products[${index}][product]`, item._id);
        formBody.append(`products[${index}][quantity]`, item.quantity);
      });

      formBody.append("shippingAddress[fullName]", shipping.fullName);
      formBody.append("shippingAddress[phone]", shipping.phone);
      formBody.append("shippingAddress[city]", shipping.city);
      formBody.append(
        "shippingAddress[governorate]",
        shipping.governorate
      );

      const res = await axios.post(
        "https://genglow-backend.vercel.app/api/orders",
        formBody,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/checkout/${res.data.order._id}`);
    } catch (err) {
      showAlert(
        "error",
        err.response?.data?.message ||
          "Failed to create order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-wrapper">
        <div className="checkout-left">
          <h1>Order</h1>

          <div className="section">
            <h3>Shipping Details</h3>

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={shipping.fullName}
              onChange={handleChange}
              className="checkout-input"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={shipping.phone}
              onChange={handleChange}
              className="checkout-input"
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={shipping.city}
              onChange={handleChange}
              className="checkout-input"
            />

            <input
              type="text"
              name="governorate"
              placeholder="Governorate"
              value={shipping.governorate}
              onChange={handleChange}
              className="checkout-input"
            />

            {alertType && (
              <>
                <br />
                <Alerts type={alertType} message={alertMessage} />
              </>
            )}
          </div>

          <button
            className="pay-btn"
            disabled={loading}
            onClick={handleCreateOrder}
          >
            {loading ? "Creating Order..." : "Proceed to Checkout"}
          </button>
        </div>

        <div className="checkout-right">
          <h3>Order Summary</h3>

          {cart.map((item) => (
            <div className="summary-item" key={item._id}>
              <img
                src={getProductImage(item._id)}
                alt={item.name}
              />

              <div>
                <p>{item.name}</p>
                <small>Qty: {item.quantity}</small>
              </div>

              <strong>
                EGP {item.price * item.quantity}
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

export default Order;
