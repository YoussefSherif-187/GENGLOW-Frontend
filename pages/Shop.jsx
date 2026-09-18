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
     MOCK PRODUCTS — FRONTEND ONLY
  ===================== */
  useEffect(() => {
    const mockProducts = [
      { _id: "1", name: "Glow Cleanser", price: 450, category: "Skincare", description: "Gentle daily cleanser" },
      { _id: "2", name: "GenGlow Serum", price: 750, category: "Skincare", description: "Personalized glow serum" },
      { _id: "3", name: "Daily Glow Cream", price: 600, category: "Skincare", description: "Nourishing daily moisturizer" },
      { _id: "4", name: "Glow Hair Mask", price: 500, category: "Haircare", description: "Repairing hair treatment" },
      { _id: "5", name: "GenGlow Shampoo", price: 350, category: "Haircare", description: "Gentle strengthening shampoo" },
      { _id: "6", name: "Glow Sunscreen", price: 550, category: "Skincare", description: "Daily broad-spectrum protection" },
    ];
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
    setRatings(Object.fromEntries(mockProducts.map((product) => [product._id, 4.5])));
  }, []);

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
