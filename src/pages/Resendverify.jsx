import React, { useState } from "react";
import axios from "axios";
import "../pagesstyles/signup.css"
import Alerts from "../comp/Alerts";

const Resendverify = () => {
  const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
  
  const [email, setEmail] = useState("");

const ResendverifyHanlder = async () => {
    await axios
      .post("https://genglow-backend.vercel.app/api/auth/resend-code", {
        email: email,
      })
      .then(response => {
        setSuccessMessage("New verification code sent to your email");
    setErrorMessage("");
      })
      .catch(error => {
        console.log("Full error response:", error.response);

  const data = error?.response?.data;

  const backendMessage =
    data?.message ||
    data?.error ||
    data?.msg ||
    (typeof data === "string" ? data : null) ||
    "An unexpected error occurred.";

  setErrorMessage(backendMessage);
  setSuccessMessage("");
      });
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