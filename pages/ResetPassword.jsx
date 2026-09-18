import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../pagesstyles/signup.css";
import Alerts from "../comp/Alerts";
import keypic from "../assets/key.png";

const ResetPassword = () => {
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const ResetPasswordHandler = () => {
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      setSuccessMessage("");
      return;
    }
    setSuccessMessage("Password has been reset successfully!");
    setErrorMessage("");
  };

  return (
    <div>
      <div className="signbody">
        <div className="wrapper">
          <p>Reset Your Password</p>
          <p id="error-message"></p>

          <form id="form">
            <div>
              <label htmlFor="password-input">
 <img src={keypic} height="24" width="24" alt="" />
               </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                id="password-input"
                placeholder="New Password"
              />
            </div>
          </form>

          <button onClick={ResetPasswordHandler}>Reset Password</button>
          <br />

          {successMessage && (
            <Alerts type="success" message={successMessage} />
          )}
          {errorMessage && <Alerts type="error" message={errorMessage} />}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
