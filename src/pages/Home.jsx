import { useContext, useEffect, useState } from "react";
import "../pagesstyles/home.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../cart/CartContext";

import cart from "../assets/cart.png";

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);

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
    axios
      .get("https://genglow-backend.vercel.app/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <div className="homebody">
        {/* =====================
            HERO
        ===================== */}
        <div className="hometop">
          <h1>
            <span style={{ color: "green" }}>ORGANIC CARE</span>
            <br />
            GENETICALLY PERSONALIZED <br /> FOR YOUR{" "}
            <span style={{ color: "green" }}>GLOW</span>
          </h1>

          <div className="home-cta">
            <button
              type="button"
              className="btn-quiz"
              onClick={() => navigate("/requestsample")}
            >
              TRY SAMPLE NOW
            </button>
          </div>
        </div>

        {/* =====================
            MIDDLE CTA
        ===================== */}
        <div className="homemiddle">
          <h1>Unlock Your True Glow with GENGLOW</h1>
          <p>
            With a quick and easy genetic test we personalize your skincare like
            never before backed by science powered by you
          </p>

          <div className="home-cta">
            <button
              type="button"
              className="btn-quiz"
              onClick={() => navigate("/genquiz")}
            >
              TAKE GENETIC QUIZ
            </button>
          </div>
        </div>

        {/* =====================
            PRODUCTS
        ===================== */}
        <div className="homebottom">
          <h1>
            OR BUY OUR <span style={{ color: "green" }}>PRODUCTS</span>{" "}
            DIRECTLY
          </h1>

          <div className="container">
            <div className="row justify-content-center">
              {products.map((product) => (
                <div className="col-auto" key={product._id}>
                  <div className="wsk-cp-product">
                    {/* IMAGE → PRODUCT PAGE */}
                    <div
                      className="wsk-cp-img"
                      onClick={() =>
                        navigate(`/product/${product._id}`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={getProductImage(product._id)}
                        alt={product.name}
                        className="img-responsive"
                      />
                    </div>

                    <div className="wsk-cp-text">
                      <div className="category">
                        <span>{product.category}</span>
                      </div>

                      <div className="title-product">
                        <h3>{product.name}</h3>
                      </div>

                      <div className="description-prod">
                        <p>{product.description}</p>
                      </div>

                      <div className="card-footer">
                        <div className="wcf-left">
                          <span className="price">
                            {product.price} EGP
                          </span>
                        </div>

                        {/* CART ICON → ADD TO CART */}
                        <button
                          className="add-to-cart-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                        >
                          <img src={cart} alt="Add to cart" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {products.length === 0 && (
                <p>Loading products...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
