import React, { useState } from "react";
import axios from "axios";
import keypic from '../assets/key.png'
import "../pagesstyles/signup.css"
import Alerts from "../comp/Alerts";
const Verify = () => {
  const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  
  const VerifyHanlder = async () => {
    await axios
      .post("https://genglow-backend.vercel.app/api/auth/verify-email", {
        email: email,
        code: code,
      })
      .then(response => {
        setSuccessMessage("Email verfied successfully!");
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
<h1>Verification</h1>
<p id="error-message"></p>
<form id="form">
<div>
  <label for="email-input">
    <span>@</span>
  </label>
  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" id="email-input" placeholder="Email"/>
</div>
<div>
  <label for="code-input">
      <img src={keypic} alt="" height="24" viewBox="0 -960 960 960" width="24"/>
  </label>
  <input type="code" value={code} onChange={(e) => setCode(e.target.value)} name="code"  id="code-input" placeholder="Code"/>
</div>
</form>
<a href="resendverify">Resend verification code</a>
  <button onClick={VerifyHanlder}>Verify</button>
  {successMessage && <Alerts type="success" message={successMessage} />}
{errorMessage && <Alerts type="error" message={errorMessage} />}
</div>

</div>

</div> )
}

export default Verify