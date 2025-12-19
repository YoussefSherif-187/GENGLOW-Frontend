import React from "react";
import "../pagesstyles/contact.css";

const Contact = () => {
  return (
    <div className="contact-con">
      <div className="contact-page">
        <h1 className="contact-title">Contact us</h1>

        <div className="contact-section">
          <h4>WE’RE HERE FOR YOU. SAY HI.</h4>
          <p>Chat with us</p>
          <p>
            Text us at <strong>01234567890</strong>
          </p>
        </div>

        <hr />

        <div className="contact-section">
          <h4>LET'S CONNECT</h4>
          <p>
            For press inquiries or partnerships, please email{" "} <br/>
            <a href="mailto:support@genglow.com">support@genglow.com</a>.
          </p>
        </div>

        <hr />

        <div className="contact-section">
          <h4>OFFICE IN ALEXANDRIA</h4>
          <p>GenGlow</p>
          <p>Alexandria, Egypt</p>
        </div>

        <hr />

        <div className="contact-section">
          <h4>FOLLOW US</h4>
          <a
            href="https://www.facebook.com/p/GenGlow-61575790294421/"
            target="_blank"
            rel="noreferrer"
          >
            Facebook
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
