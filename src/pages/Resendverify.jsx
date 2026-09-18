import React, { useState } from "react";
import "../pagesstyles/signup.css"
import Alerts from "../comp/Alerts";

const Resendverify = () => {
  const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
  
  const [email, setEmail] = useState("");

const ResendverifyHanlder = () => {
    if (!email.trim()) {
      setErrorMessage("Please enter your email.");
      setSuccessMessage("");
      return;
    }
    setSuccessMessage("New verification code sent to your email.");
    setErrorMessage("");
  };

  return (
    <div>
        <div class="signbody">

<div class="wrapper">
    <h1>Resend Code</h1>
    <p id="error-message"></p>
    <form id="form">
      <div>
        <label for="email-input">
          <span>@</span>
        </label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" id="email-input" placeholder="Email"/>
      </div>
      <div>
        
      </div>
      
    </form>
    <button onClick={ResendverifyHanlder}>Send New Code</button>
    {successMessage && <Alerts type="success" message={successMessage} />}
    {errorMessage && <Alerts type="error" message={errorMessage} />}
  </div>

  </div>

    </div>
  )
}

export default Resendverify