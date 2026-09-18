import { useContext } from "react";
import "../pagesstyles/home.css";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../cart/CartContext";

import cart from "../assets/cart.png";

const MOCK_PRODUCTS = [
  {
    _id: "1",
    prodId: "prod1",
    name: "Glow Cleanser",
    price: 24.99,
    category: "Skincare",
    description:
      "A gentle daily cleanser that removes impurities while leaving skin fresh, soft, and comfortable.",
  },
  {
    _id: "2",
    prodId: "prod2",
    name: "GenGlow Vitamin C Serum",
    price: 39.99,
    category: "Serum",
    description:
      "A lightweight brightening serum designed to support a smoother, more radiant-looking complexion.",
  },
  {
    _id: "3",
    prodId: "prod3",
    name: "Daily Glow Cream",
    price: 29.99,
    category: "Moisturizer",
    description:
      "A nourishing daily moisturizer that helps keep skin hydrated, soft, and visibly healthy.",
  },
  {
    _id: "4",
    prodId: "prod4",
    name: "Hydra Balance Toner",
    price: 21.99,
    category: "Toner",
    description:
      "A refreshing toner that helps replenish moisture and prepares the skin for the rest of your routine.",
  },
  {
    _id: "5",
    prodId: "prod5",
    name: "Radiance Face Mask",
    price: 27.99,
    category: "Mask",
    description:
      "A pampering face mask formulated for a fresh, smooth, and naturally radiant-looking finish.",
  },
  {
    _id: "6",
    prodId: "prod6",
    name: "Glow Eye Cream",
    price: 34.99,
    category: "Eye Care",
    description:
      "A lightweight eye cream made for the delicate eye area to help it look refreshed and hydrated.",
  },
  {
    _id: "7",
    prodId: "prod7",
    name: "Skin Barrier Lotion",
    price: 31.99,
    category: "Moisturizer",
    description:
      "A comforting lotion that supports long-lasting hydration and a soft, balanced skin feel.",
  },
  {
    _id: "8",
    prodId: "prod8",
    name: "Gentle Exfoliating Gel",
    price: 26.99,
    category: "Exfoliator",
    description:
      "A gentle exfoliating gel that helps lift away surface buildup for smoother-looking skin.",
  },
  {
    _id: "9",
    prodId: "prod9",
    name: "Overnight Glow Mask",
    price: 36.99,
    category: "Mask",
    description:
      "A rich overnight treatment that helps skin feel replenished, moisturized, and refreshed by morning.",
  },
  {
    _id: "10",
    prodId: "prod10",
    name: "Daily SPF Face Cream",
    price: 32.99,
    category: "Sun Care",
    description:
      "A lightweight daily face cream designed to provide comfortable hydration as part of your daytime routine.",
  },
  {
    _id: "11",
    prodId: "prod11",
    name: "Nourishing Face Oil",
    price: 38.99,
    category: "Face Oil",
    description:
      "A silky facial oil that adds nourishing moisture and leaves skin feeling soft and supple.",
  },
  {
    _id: "12",
    prodId: "prod12",
    name: "GenGlow Hydration Mist",
    price: 19.99,
    category: "Mist",
    description:
      "A refreshing facial mist that gives skin a quick boost of lightweight hydration throughout the day.",
  },
];

const getProductImage = (prodId) => {
  try {
    return require(`../assets/products/${prodId}.png`);
  } catch (err) {
    return require("../assets/products/prod1.png");
  }
};

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const products = MOCK_PRODUCTS;

  return (
    <div>
      <div className="homebody">

        <div className="hometop">
          <h1>
            <span style={{ color: "green" }}>ORGANIC CARE</span>
            <br />
            GENETICALLY PERSONALIZED <br />
            FOR YOUR <span style={{ color: "green" }}>GLOW</span>
          </h1>

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

        <div className="homemiddle">
          <h1>Unlock Your True Glow with GENGLOW</h1>

          <p>
            Start with a personalized skincare sample, crafted with science
            and tailored to you, designed to let your skin experience the
            difference first.
          </p>

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

                    <div
                      className="wsk-cp-img"
                      onClick={() =>
                        navigate(`/product/${product._id}`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={getProductImage(product.prodId)}
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

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;