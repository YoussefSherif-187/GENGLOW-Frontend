import { useContext } from "react";
import { CartContext } from "../cart/CartContext";
import { useNavigate } from "react-router-dom";
import "../pagesstyles/cart.css";

function CartSidebar() {
  const navigate = useNavigate();

  const { cart, isOpen, closeCart, increaseQty, decreaseQty } =
    useContext(CartContext);

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

  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      closeCart();
      window.scrollTo({ top: 0, behavior: "instant" });
      navigate("/signin");
      return;
    }

    if (role !== "user") {
      closeCart();
      window.scrollTo({ top: 0, behavior: "instant" });
      navigate("/unauthorized");
      return;
    }

    closeCart();
    navigate("/order");
  };

  return (
    <div
      className={`cart-overlay ${isOpen ? "show" : ""}`}
      onClick={closeCart}
    >
      <div
        className="cart-sidebar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cart-header">
          <h2>CART</h2>
          <button className="close-btn" onClick={closeCart}>
            ×
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 && (
            <p style={{ color: "#ccc", textAlign: "center" }}>
              Your cart is empty
            </p>
          )}

          {cart.map((item) => (
            <div className="cart-item" key={item._id}>
              <img
                src={getProductImage(item._id)}
                alt={item.name}
              />

              <div className="cart-info">
                <h3>{item.name}</h3>
                <p>{item.price} EGP</p>

                <div className="item-qty">
                  <button onClick={() => decreaseQty(item._id)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item._id)}>
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-footer">
          <div className="subtotal">
            <span>SUBTOTAL</span>
            <strong>{subtotal} EGP</strong>
          </div>

          <p className="cart-note">
            Shipping, taxes, and discount codes calculated at checkout.
          </p>

          <button
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={cart.length === 0}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartSidebar;
