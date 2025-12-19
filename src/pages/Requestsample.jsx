import React, { useState } from "react";
import "../pagesstyles/requestsample.css";
import axios from "axios";
import Alerts from "../comp/Alerts"; 

const Requestsample = () => {
  const [selectedSamples, setSelectedSamples] = useState([]);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const samples = [
    { id: "692c67e3639f7fc253aafde1", icon: "fa-pump-soap", title: "Herbal Acne Serum", desc: "Helps calm breakouts with soothing herbal extracts" },
    { id: "692c67e4639f7fc253aafde7", icon: "fa-prescription-bottle", title: "Brightening Vitamin C Cream", desc: "Boosts glow with vitamin C and botanicals" },
    { id: "692c67e3639f7fc253aafde5", icon: "fa-tint", title: "Hydrating Aloe Gel", desc: "Deeply hydrates scalp and supports healthy hair" },
    { id: "692c67e5639f7fc253aafdf1", icon: "fa-magic", title: "Rejuvenating Night Cream", desc: "Nourishes skin overnight with collagen-rich formula" },
    { id: "692c67e4639f7fc253aafdeb", icon: "fa-sun", title: "Strengthening Hibiscus Oil", desc: "Protects skin with plant-based SPF defense" },
    { id: "692c67e5639f7fc253aafdf3", icon: "fa-seedling", title: "Detox Herbal Tea", desc: "Supports scalp health and reduces dandruff" }
  ];

  const handleSampleChange = (sampleId) => {
    if (selectedSamples.includes(sampleId)) {
      setSelectedSamples(selectedSamples.filter(id => id !== sampleId));
      setAlert({ type: "", message: "" });
    } else {
      if (selectedSamples.length >= 1) {
        setAlert({
          type: "error",
          message: "Please select only one sample."
        });
      } else {
        setSelectedSamples([sampleId]);
        setAlert({ type: "", message: "" });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedSamples.length !== 1) {
      setAlert({
        type: "error",
        message: "Please select exactly one sample before submitting."
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const formBody = new URLSearchParams();
      formBody.append("productId", selectedSamples[0]);

      const response = await axios.post(
        "https://genglow-backend.vercel.app/api/samplerequests",
        formBody,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAlert({
        type: "success",
        message: "Your sample request has been received successfully!"
      });

      setSelectedSamples([]);

      console.log("API response:", response.data);

    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      setAlert({
        type: "error",
        message
      });
    }
  };

  return (
    <main>
      <section className="sample-request-section">
        <div className="container">
          <div className="form-container">
            <h2>Request Free Samples</h2>
            <p>
              Choose one sample from our products and we will send them to you for free.
            </p>

           
           

            <form id="sample-form" onSubmit={handleSubmit}>
              <div className="form-section">
                <div className="samples-grid">
                  {samples.map(sample => (
                    <div key={sample.id} className="sample-item">
                      <input
                        type="checkbox"
                        id={sample.id}
                        checked={selectedSamples.includes(sample.id)}
                        onChange={() => handleSampleChange(sample.id)}
                      />
                      <label htmlFor={sample.id}>
                        <div className="sample-icon">
                          <i className={`fas ${sample.icon}`}></i>
                        </div>
                        <h4>{sample.title}</h4>
                        <p>{sample.desc}</p>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-submit">
                <button
                  type="submit"
                  className="btn btn-primary btn-large"
                >
                  Request Free Samples
                </button>
              </div>
              <br/>
               {alert.message && (
              <Alerts type={alert.type} message={alert.message} />
            )}
            </form>
          </div>
        </div>
      </section>

      <section className="why-samples bg-light">
        <div className="container">
          <h2 className="section-title">Why Request Free Samples?</h2>

          <div className="feature-cards">
            <div className="feature-card">
              <i className="fas fa-check-circle"></i>
              <h3>Ensure Suitability</h3>
              <p>
                Test the product on your skin or hair to ensure it's suitable for you before purchasing the full size.
              </p>
            </div>

            <div className="feature-card">
              <i className="fas fa-hand-holding-heart"></i>
              <h3>Explore Products</h3>
              <p>
                Discover the quality of our natural products and their effectiveness in treating various problems.
              </p>
            </div>

            <div className="feature-card">
              <i className="fas fa-shipping-fast"></i>
              <h3>Free Shipping</h3>
              <p>
                We will send the samples to your home for free without any additional cost.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Requestsample;
