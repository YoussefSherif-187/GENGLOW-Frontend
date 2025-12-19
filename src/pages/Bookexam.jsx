import React, { useState } from 'react'
import "../pagesstyles/bookexam.css"
import axios from "axios"
import Alerts from "../comp/Alerts" // ✅ standard import

const Bookexam = () => {
  const [formData, setFormData] = useState({
    preferredDate: '',
    notes: '',
  })

  const [loading, setLoading] = useState(false)
  const [activeFaq, setActiveFaq] = useState(null)
  const [alert, setAlert] = useState({ type: "", message: "" })

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      const token = localStorage.getItem("token")
      const formBody = new URLSearchParams()

      formBody.append("date", formData.preferredDate)
      formBody.append("notes", formData.notes)

      await axios.post(
        "https://genglow-backend.vercel.app/api/examinations",
        formBody,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setAlert({
        type: "success",
        message: "Examination booked successfully!"
      })

      setFormData({
        preferredDate: '',
        notes: '',
      })

    } catch (err) {
      setAlert({
        type: "error",
        message:
          err.response?.data?.message ||
          "Failed to book examination. Please try again."
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  const faqs = [
    {
      question: 'How is the genetic test performed?',
      answer:
        'The test is performed by taking a small sample of inner cheek cells using a special swab, which is then analyzed in our specialized laboratories to determine your genetic characteristics related to skin and hair.'
    },
    {
      question: 'How long does it take to get test results?',
      answer:
        'Test results appear within 7-10 business days from the date of sample collection. Results will be sent to your registered email address, and one of our consultants will contact you.'
    },
    {
      question: 'What is the cost of the genetic test?',
      answer:
        'The basic genetic test costs 1200 EGP. We also offer comprehensive packages with special discounts.'
    }
  ]

  return (
    <main>
      <section className="booking-section">
        <div className="container">
          <div className="form-container">
            <h2>Genetic Test Booking Form</h2>
            <p>
              Please fill out the form below to book an appointment for genetic testing.
              A customer service representative will contact you to confirm the appointment.
            </p>

            <form id="booking-form" onSubmit={handleSubmit}>
              <div className="form-section">
                <h3>Appointment Details</h3>

                <div className="form-group">
                  <label htmlFor="preferred-date">Preferred Date *</label>
                  <input
                    type="date"
                    id="preferred-date"
                    className="form-control"
                    required
                    value={formData.preferredDate}
                    onChange={(e) =>
                      setFormData({ ...formData, preferredDate: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    className="form-control"
                    placeholder="Describe your concern..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-submit">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Booking..." : "Confirm Booking"}
                </button>

                <br />

                {/* ✅ Alert under button (standard) */}
                {alert.message && (
                  <Alerts type={alert.type} message={alert.message} />
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="faq-section bg-light">
        <div className="container">
          <h2 className="section-title">
            Frequently Asked Questions About Genetic Testing
          </h2>

          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${activeFaq === index ? 'active' : ''}`}
              >
                <div
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <h3>{faq.question}</h3>
                  <span className="faq-icon">
                    <i
                      className={`fas ${
                        activeFaq === index ? 'fa-minus' : 'fa-plus'
                      }`}
                    ></i>
                  </span>
                </div>

                <div
                  className="faq-answer"
                  style={{ maxHeight: activeFaq === index ? '1000px' : '0' }}
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Bookexam
