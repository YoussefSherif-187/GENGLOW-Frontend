import React, { useState } from 'react'
import "../pagesstyles/about.css"
import aboutimg from "../assets/aboutimg.png"
import heroImg from "../assets/hero.png"
import handsImg from "../assets/story1.png"
import doctorImg from "../assets/story2.png"
import creamImg from "../assets/story3.png"



const Aboutus = () => {
  const [activeFaq, setActiveFaq] = useState(null)


const toggleFaq = (index) => {
  
    setActiveFaq(activeFaq === index ? null : index)
  }

  const faqs = [
  {
    question: 'What is GenGlow?',
    answer:
      'GenGlow is a personalized skincare and haircare platform that combines genetic insights, science, and natural herbal ingredients to create products tailored specifically to your needs.'
  },
  {
    question: 'How does GenGlow personalize my products?',
    answer:
      'We analyze your skin and hair characteristics through a genetic-based assessment and expert evaluation. Our pharmacists then create customized herbal formulations designed to work best with your unique profile.'
  },
  {
    question: 'Are GenGlow products safe for sensitive skin?',
    answer:
      'Yes. All GenGlow products are made with 100% natural, organic ingredients and are pharmacist-approved. We also offer sensitivity testing to ensure compatibility before full use.'
  },
  {
    question: 'Do I need a genetic test to use GenGlow?',
    answer:
      'Genetic testing allows us to deliver the most accurate and personalized results. It helps identify sensitivities, strengths, and specific care needs for your skin and hair.'
  },
  {
    question: 'Who creates the GenGlow formulations?',
    answer:
      'Our formulations are developed by licensed pharmacists in collaboration with Faculty of Science graduates, combining scientific research with traditional herbal knowledge.'
  },
  {
    question: 'Can I try GenGlow products before buying full-size items?',
    answer:
      'Yes. We provide sample options and sensitivity testing so you can experience the benefits and confirm suitability before committing to full-size products.'
  },
  {
    question: 'How do I get started with GenGlow?',
    answer:
      'Simply sign up on the GenGlow website, complete your assessment, and book a consultation. From there, we guide you every step of the way toward personalized care.'
  }
];


  return (
    <div>
      <div class="aboutbody">
  
  <section className="about-hero">
  <div className="hero-image">
    <img src={heroImg} alt="GenGlow products" />
  </div>

  <div className="hero-text">
    <h1>Oh hey there!</h1>
    <p>
      Welcome to <strong>Genglow</strong>.  
      We combine science, nature, and innovation to help you understand
      your skin better and glow with confidence.
    </p>
    <p>
      If you’re here, you’re already one step closer to personalized care designed just for you.
    </p>
  </div>
</section>


      {/* STORY SECTION 1 */}
      <section className="story-section">
  <div className="story-text">
    <p>
      GenGlow is a next-generation skincare and haircare platform built on personalization, science, and nature. We create customized herbal solutions tailored to each individual’s unique genetic profile, moving beyond one-size-fits-all beauty products.
    </p>
  </div>

  <div className="story-image">
    <img src={handsImg} alt="Pharmacist consultation" />
  </div>
</section>


      {/* STORY SECTION 2 */}
      <section className="story-section reverse">
  <div className="story-image">
    <img src={doctorImg} alt="Skincare application" />
  </div>

  <div className="story-text">
    <p>
      By combining advanced genetic analysis with traditional herbal medicine, our expert pharmacists and science graduates formulate safe, organic, and effective products designed specifically for your skin and hair needs. Through our easy-to-use online platform, users can complete assessments, book expert consultations, and receive personalized recommendations they can trust.
    </p>
  </div>
</section>


      {/* STORY SECTION 3 */}
      <section className="story-section">
  <div className="story-text">
    <p>
      GenGlow exists to solve a growing problem in the beauty industry: lack of personalization, transparency, and true organic care. With sensitivity testing, product samples, and science-backed guidance, we deliver a smarter, safer, and more sustainable approach to beauty and wellness.
    </p>
  </div>

  <div className="story-image">
    <img src={creamImg} alt="Natural herbal ingredients" />
  </div>
</section>

  <section class="team">
    <h2>Meet Our Team</h2>
    <p>Our dedicated professionals work every day to ensure you receive the best skincare experience possible.</p>

    <div class="team-members">
      <div class="member">
        <h4>Rewan Hesham</h4>
     
      </div>
      <div class="member">
        <h4>Rewan Mohamed</h4>
    
      </div>
      <div class="member">
        <h4>Youssef Sherif</h4>
     
      </div>
      <div class="member">
        <h4>Ahmed Amr</h4>
      
      </div>
      
    </div>
  </section>
  <section className="faq-section bg-light">
        <div className="container">
          <h2 className="section-title">
            FAQs
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
</div>
    </div>
  )
}

export default Aboutus