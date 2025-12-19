import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CartContext } from "../cart/CartContext";
import "../pagesstyles/shop.css";

const Shop = () => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [ratings, setRatings] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 6;

  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");

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
     FETCH PRODUCTS
  ===================== */
  useEffect(() => {
    fetch("https://genglow-backend.vercel.app/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        fetchRatings(data);
      });
  }, []);

  /* =====================
     FETCH RATINGS
  ===================== */
  const fetchRatings = async (products) => {
    const ratingMap = {};

    await Promise.all(
      products.map(async (product) => {
        try {
          const res = await fetch(
            `https://genglow-backend.vercel.app/api/reviews/product/${product._id}`
          );
          const reviews = await res.json();

          if (reviews.length > 0) {
            const avg =
              reviews.reduce((sum, r) => sum + r.rating, 0) /
              reviews.length;
            ratingMap[product._id] = avg.toFixed(1);
          } else {
            ratingMap[product._id] = 0;
          }
        } catch {
          ratingMap[product._id] = 0;
        }
      })
    );

    setRatings(ratingMap);
  };

  /* =====================
     FILTER LOGIC
  ===================== */
  useEffect(() => {
    let filtered = [...products];

    if (category !== "All") {
      filtered = filtered.filter(
        (p) => p.category === category
      );
    }

    if (maxPrice) {
      filtered = filtered.filter(
        (p) => p.price <= Number(maxPrice)
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [category, maxPrice, products]);

  /* =====================
     PAGINATION
  ===================== */
  const lastIndex = currentPage * productsPerPage;
  const firstIndex = lastIndex - productsPerPage;
  const currentProducts = filteredProducts.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  /* =====================
     STAR RENDER
  ===================== */
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;

    return (
      <div className="stars">
        {"★".repeat(fullStars)}
        {"☆".repeat(emptyStars)}
        <span className="rating-number">
          {rating > 0 ? rating : "No reviews"}
        </span>
      </div>
    );
  };

  return (
    <div className="product-section">
      <h2 className="product-title">OR BUY OUR PRODUCTS DIRECTLY</h2>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Skin Care">Skin Care</option>
          <option value="Hair Care">Hair Care</option>
        </select>

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {/* PRODUCTS */}
      <div className="product-grid">
        {currentProducts.map((product) => (
          <div className="product-card" key={product._id}>
            <img
              src={getProductImage(product._id)}
              alt={product.name}
              className="product-img"
            />

            <h3 className="product-name">{product.name}</h3>

            {renderStars(ratings[product._id] || 0)}

            <p className="product-description">
              {product.description.slice(0, 80)}...
            </p>

            <p className="product-price">{product.price} EGP</p>

            <div className="product-buttons">
              <button
                className="btn-add"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>

              <button
                className="btn-details"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                More Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Shop;
