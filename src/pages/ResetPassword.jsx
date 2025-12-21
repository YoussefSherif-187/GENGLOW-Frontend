import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../pagesstyles/signup.css";
import Alerts from "../comp/Alerts";
import keypic from "../assets/key.png";

const ResetPassword = () => {
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const ResetPasswordHandler = async () => {
    await axios
      .post(
        `https://genglow-backend.vercel.app/api/auth/reset-password/${token}`,
        {
          password: password,
        }
      )
      .then((response) => {
        setSuccessMessage(
          response?.data?.message || "Password has been reset successfully!"
        );
        setErrorMessage("");
      })
      .catch((error) => {
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
