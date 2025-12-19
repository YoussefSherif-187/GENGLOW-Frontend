import React, { useState, useEffect, useContext } from "react";
import "../pagesstyles/genquiz.css";
import axios from "axios";
import Alerts from "../comp/Alerts";
import { CartContext } from "../cart/CartContext";

const quizQuestions = [
  {
    section: "Skin & Hair Profile",
    questions: [
      { id: "skinType", question: "What is your skin type?", type: "single", options: ["Oily", "Dry", "Combination", "Sensitive", "Normal"] },
      { id: "skinConcerns", question: "Do you experience any of the following?", type: "multiple", options: ["Acne", "Pigmentation", "Wrinkles", "Redness", "None"] },
      { id: "hairType", question: "What is your hair type?", type: "single", options: ["Straight", "Wavy", "Curly", "Coily"] },
      { id: "hairConcerns", question: "What hair issues do you face?", type: "multiple", options: ["Hair fall", "Dandruff", "Frizz", "Split ends", "None"] },
    ],
  },
  {
    section: "Lifestyle & Environment",
    questions: [
      { id: "sleepHours", question: "How many hours of sleep do you get on average?", type: "single", options: ["<5", "5-7", "7-9", ">9"] },
      { id: "pollutionExposure", question: "How often are you exposed to pollution/sunlight?", type: "single", options: ["Rarely", "Sometimes", "Daily"] },
      { id: "diet", question: "How is your diet?", type: "single", options: ["Balanced", "High in sugar", "Low in protein", "Vegan"] },
    ],
  },
  {
    section: "Genetic Traits (Family History)",
    questions: [
      { id: "familyHistory", question: "Does anyone in your family have any of the following?", type: "multiple", options: ["Premature graying", "Sensitive skin", "Hair loss", "Eczema"] },
      { id: "allergies", question: "Do you have any known allergies to natural products?", type: "multiple", options: ["Herbs", "Oils", "Nuts", "None"] },
    ],
  },
  {
    section: "Goals",
    questions: [
      {
        id: "goals",
        question: "What are your top skincare/haircare goals?",
        type: "multiple",
        options: [
          "Brighten skin",
          "Control acne",
          "Stimulate hair growth",
          "Reduce frizz",
          "Improve scalp health",
          "Anti-aging",
          "Relaxation",
        ],
      },
    ],
  },
];

const Genquiz = () => {
  const { addToCart, setIsOpen } = useContext(CartContext);

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleRadioChange = (id, value) => {
    setUserResponses({ ...userResponses, [id]: value });
  };

  const handleCheckboxChange = (id, value, checked) => {
    const values = userResponses[id] || [];
    setUserResponses({
      ...userResponses,
      [id]: checked ? [...values, value] : values.filter(v => v !== value),
    });
  };

  const navigatePrev = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
    }
  };

  const isCurrentSectionAnswered = () => {
    const currentSection = quizQuestions[currentSectionIndex];
    return currentSection.questions.every(q => {
      const answer = userResponses[q.id];
      if (q.type === "single") return !!answer;
      if (q.type === "multiple") return Array.isArray(answer) && answer.length > 0;
      return false;
    });
  };

  const submitQuiz = async () => {
    try {
      setLoading(true);
      setAlert({ type: "", message: "" });

      const token = localStorage.getItem("token");
      const formBody = new URLSearchParams();

      if (userResponses.skinType) formBody.append("skinType", userResponses.skinType.toLowerCase());
      if (userResponses.hairType) formBody.append("hairType", userResponses.hairType.toLowerCase());
      if (userResponses.sleepHours) formBody.append("sleepHours", userResponses.sleepHours);
      if (userResponses.pollutionExposure) formBody.append("pollutionExposure", userResponses.pollutionExposure.toLowerCase());
      if (userResponses.diet) formBody.append("diet", userResponses.diet.toLowerCase());

      userResponses.skinConcerns?.forEach(v => formBody.append("skinConcerns[]", v.toLowerCase()));
      userResponses.hairConcerns?.forEach(v => formBody.append("hairConcerns[]", v.toLowerCase()));
      userResponses.familyHistory?.forEach(v => formBody.append("familyHistory[]", v.toLowerCase()));
      userResponses.allergies?.forEach(v => formBody.append("allergies[]", v.toLowerCase()));
      userResponses.goals?.forEach(v => formBody.append("goals[]", v.toLowerCase()));

      const response = await axios.post(
        "https://genglow-backend.vercel.app/api/quizResults",
        formBody,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecommendedProducts(response.data.quizResult?.recommendedProducts || []);
      setQuizCompleted(true);

      setAlert({
        type: "success",
        message: "Quiz submitted successfully! Here are your recommendations.",
      });
    } catch {
      setAlert({
        type: "error",
        message: "Failed to submit quiz. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateNext = () => {
    if (currentSectionIndex < quizQuestions.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
    } else {
      submitQuiz();
    }
  };

  useEffect(() => {
    if (currentSectionIndex > 0 && !quizCompleted) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentSectionIndex, quizCompleted]);

  const currentSection = quizQuestions[currentSectionIndex];

  return (
    <main>
      <section className="quiz-page">
        <div className="container">
          <div className="quiz-container">
            <div className="quiz-header">
              <h2>Genetic Test for Skincare and Haircare</h2>
            </div>

            {!quizCompleted ? (
              <>
                <div className="quiz-section">
                  <h3>{currentSection.section}</h3>

                  {currentSection.questions.map(q => (
                    <div key={q.id} className="quiz-question">
                      <h3>{q.question}</h3>
                      <div className="options-list">
                        {q.type === "single"
                          ? q.options.map(opt => (
                              <label
                                key={opt}
                                className={`option-item ${userResponses[q.id] === opt ? "selected" : ""}`}
                              >
                                <input
                                  type="radio"
                                  checked={userResponses[q.id] === opt}
                                  onChange={() => handleRadioChange(q.id, opt)}
                                />
                                {opt}
                              </label>
                            ))
                          : q.options.map(opt => (
                              <label
                                key={opt}
                                className={`option-item ${userResponses[q.id]?.includes(opt) ? "selected" : ""}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={userResponses[q.id]?.includes(opt) || false}
                                  onChange={e => handleCheckboxChange(q.id, opt, e.target.checked)}
                                />
                                {opt}
                              </label>
                            ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="quiz-nav">
                  <button
                    className="btn btn-secondary"
                    disabled={currentSectionIndex === 0}
                    onClick={navigatePrev}
                  >
                    Previous
                  </button>

                  <span>{currentSectionIndex + 1} / {quizQuestions.length}</span>

                  <button
                    className="btn btn-primary"
                    disabled={loading || !isCurrentSectionAnswered()}
                    onClick={navigateNext}
                  >
                    {loading
                      ? "Submitting..."
                      : currentSectionIndex === quizQuestions.length - 1
                      ? "Submit Results"
                      : "Next"}
                  </button>
                </div>
              </>
            ) : (
              <div className="quiz-result">
                <h2>Your Recommended Products</h2>

                {recommendedProducts.map(product => (
                  <div key={product._id} className="recommended-product-card">
                    <p><strong>Name:</strong> {product.name}</p>
                    <p><strong>Price:</strong> ${product.price}</p>
                    <p><strong>Category:</strong> {product.category}</p>

                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        addToCart(product);
                        setIsOpen(true);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}

                <br />

                {alert.message && (
                  <Alerts type={alert.type} message={alert.message} />
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Genquiz;
