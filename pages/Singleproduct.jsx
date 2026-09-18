import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../cart/CartContext";
import Alerts from "../comp/Alerts";
import "../pagesstyles/singleproduct.css";

function SingleProduct() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [newRating, setNewRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });

  const isLoggedIn = !!sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const canWriteReview = isLoggedIn && role === "user";

  const getProductImage = (prodId) => {
    try {
      return require(`../assets/products/${prodId}.png`);
    } catch {
      return require(`../assets/products/prod1.png`);
    }
  };
  useEffect(() => {
    const mockProducts = [
      { _id: "1", name: "Glow Cleanser", price: 24.99, description: "A gentle daily cleanser.", category: "Skincare" },
      { _id: "2", name: "GenGlow Serum", price: 39.99, description: "A personalized glow serum.", category: "Skincare" },
      { _id: "3", name: "Daily Glow Cream", price: 29.99, description: "A nourishing daily moisturizer.", category: "Skincare" },
    ];
    setProduct(mockProducts.find((item) => String(item._id) === String(id)) || mockProducts[0]);
  }, [id]);

  useEffect(() => {
    setReviews([
      { rating: 5, comment: "Great product and lovely texture." },
      { rating: 4, comment: "Feels good on the skin." },
    ]);
    setRating("4.5");
  }, [id]);


  const submitReview = (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      setAlert({
        show: true,
        type: "error",
        message: "Please write a comment",
      });
      return;
    }

    const newReview = { rating: newRating, comment };
    setReviews((prev) => [...prev, newReview]);
    setRating((prev) => {
      const numericPrev = Number(prev) || 0;
      const count = reviews.length;
      return ((numericPrev * count + newRating) / (count + 1)).toFixed(1);
    });
    setComment("");
    setNewRating(5);
    setAlert({
      show: true,
      type: "success",
      message: "Review submitted successfully!",
    });
  };


  const renderStars = (value) => {
    const full = Math.floor(Number(value) || 0);
    return (
      <span className="stars">
        {"★".repeat(full)}
        {"☆".repeat(5 - full)}
      </span>
    );
  };

  if (!product) return null;

  return (
    <div className="single-product-page">
      <div className="single-product-wrapper">
        <div className="product-image">
          <img
            src={getProductImage(product._id)}
            alt={product.name}
          />
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>

          <div className="rating-row">
            {rating > 0 ? (
              <>
                {renderStars(rating)}
                <span>{rating}</span>
              </>
            ) : (
              <span>No reviews yet</span>
            )}
          </div>

          <p className="price">{product.price} EGP</p>
          <p className="description">{product.description}</p>

          <button
            className="btn-add"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>

     
      {canWriteReview && (
        <div className="review-form">
          <h3>Write a Review</h3>

          <form onSubmit={submitReview}>
            <label>Rating</label>

            <div className="star-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${
                    star <= newRating ? "filled" : ""
                  }`}
                  onClick={() => setNewRating(star)}
                >
                  ★
                </span>
              ))}
            </div>

            <label>Comment</label>
            <textarea
              className="form-control"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
            />

            <button
              className="btn-add"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>

            <br />

            {alert.show && (
              <Alerts
                type={alert.type}
                message={alert.message}
                onClose={() =>
                  setAlert({
                    show: false,
                    type: "",
                    message: "",
                  })
                }
              />
            )}
          </form>
        </div>
      )}

  
      <div className="reviews-section">
        <h2>Customer Reviews</h2>

        {reviews.length === 0 && (
          <p className="no-reviews">No reviews yet.</p>
        )}

        {reviews.map((review) => (
          <div className="review-card" key={review._id}>
            <div className="review-header">
              <strong>{review.user?.name}</strong>
              {renderStars(review.rating)}
            </div>
            <p>{review.comment}</p>
            <small>
              {new Date(review.createdAt).toLocaleDateString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SingleProduct;
