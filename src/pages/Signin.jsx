import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";
import keypic from "../assets/key.png";
import Alerts from "../comp/Alerts";
import "../pagesstyles/signup.css";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const { login, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const SiginHanlder = async () => {
  try {
    await login(email, password);
    setSuccessMessage("Login successful");

    setTimeout(() => navigate("/home"), 500);
  } catch (e) {
    setSuccessMessage(""); // error message comes from context
  }
};


  return (
    <div>
      <div class="signbody">
        <div class="wrapper">
          <h1>Sign in</h1>

          <form>
            <div>
              <label>
                <span>@</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>

            <div>
              <label>
                <img src={keypic} height="24" width="24" alt="" />
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
          </form>

          <a href="/signup">Don't have an account?</a>
          <a href="/forgotpass">Forgot password?</a>

          <button onClick={SiginHanlder}>Sign In</button>

          {successMessage && <Alerts type="success" message={successMessage} />}
          {error && <Alerts type="error" message={error} />}
        </div>
      </div>
    </div>
  );
};

export default Signin;
