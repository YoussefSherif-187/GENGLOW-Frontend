import React, {  useState } from "react";
import { useNavigate } from 'react-router-dom';
import keypic from "../assets/key.png";
import user2 from "../assets/user2.png";
import "../pagesstyles/signup.css";
import axios from "axios";
import Alerts from "../comp/Alerts";

const Signup = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const SignupHanlder = async () => {
     if (password.length < 6) {
    setErrorMessage("Password must be at least 6 characters long.");
    return;
  }
    await axios
      .post("https://genglow-backend.vercel.app/api/auth/register", {
        name: name,
        email: email,
        password: password,
      })
      .then(response => {
        navigate('/verify');
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

      });
  };

  return (
    <div>
      <div className="signbody">

        <div className="wrapper">
          <h1>Sign up</h1>
          <p id="error-message"></p>
          <form id="form">
            <div>
              <label for="name-input">
                <img
                  src={user2}
                  alt=""
                  height="24"
                  viewBox="0 -960 960 960"
                  width="24"
                />
              </label>
              <input
                type="text"
                name="name"
                onChange={e => {
                  setName(e.target.value);
                }}
                id="name-input"
                placeholder="Name"
              />
            </div>
            <div>
              <label for="email-input">
                <span>@</span>
              </label>
              <input
                type="email"
                name="email"
                onChange={e => {
                  setEmail(e.target.value);
                }}
                id="email-input"
                placeholder="Email"
              />
            </div>
            <div>
              <label for="password-input">
                <img src={keypic} alt="" height="24" viewBox="0 -960 960 960" width="24"/>
              </label>
             <input
  type="password"
  name="password"
  minLength={6}
  onChange={e => {
    setPassword(e.target.value);
  }}
  id="password-input"
  placeholder="Password"
/>

            </div>
          </form>
          <a href="signin">Already have an account?</a>
          <a href="verify">Want to Verify your account?</a>
          <a href="Resendverify">Resend verification code</a>
          <button onClick={SignupHanlder}>Sign up</button>
          {errorMessage && <Alerts type="error" message={errorMessage} />}

         
        </div>
      </div>
    </div>
  );
};

export default Signup;
