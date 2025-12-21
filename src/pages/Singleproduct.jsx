import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../cart/CartContext";
import axios from "axios";
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

  const isLoggedIn = !!localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const canWriteReview = isLoggedIn && role === "user";

  const getProductImage = (prodId) => {
    try {
      return require(`../assets/products/${prodId}.png`);
    } catch {
      return require(`../assets/products/prod1.png`);
    }
  };


  useEffect(() => {
    axios
      .get(`https://genglow-backend.vercel.app/api/products/${id}`)
      .then((res) => setProduct(res.data));
  }, [id]);


  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(
        `https://genglow-backend.vercel.app/api/reviews/product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setReviews(res.data);

        if (res.data.length > 0) {
          const avg =
            res.data.reduce((s, r) => s + r.rating, 0) /
            res.data.length;
          setRating(avg.toFixed(1));
        }
      });
  }, [id]);


  const submitReview = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      setAlert({
        show: true,
        type: "error",
        message: "Please write a comment",
      });
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      const formBody = new URLSearchParams();
      formBody.append("product", id);
      formBody.append("rating", newRating);
      formBody.append("comment", comment);

      const res = await axios.post(
        "https://genglow-backend.vercel.app/api/reviews",
        formBody,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviews((prev) => [res.data.review, ...prev]);

      const updated =
        (Number(rating) * reviews.length + newRating) /
        (reviews.length + 1);
      setRating(updated.toFixed(1));

      setComment("");
      setNewRating(5);

      setAlert({
        show: true,
        type: "success",
        message: "Review submitted successfully",
      });
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        message:
          err.response?.data?.message ||
          "Failed to submit review",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!product) return <div className="loading">Loading...</div>;

  const renderStars = (value) => {
    const full = Math.floor(value);
    return (
      <span className="stars">
        {"★".repeat(full)}
        {"☆".repeat(5 - full)}
      </span>
    );
  };

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
