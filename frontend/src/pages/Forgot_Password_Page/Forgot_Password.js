import React, { useState } from "react";
import Logo from "../../assets/images/Main_page_icon/Logo.png";
import Croods_Chart from "../../assets/images/Main_page_icon/Croods_Chart.png";
import Facebook from "../../assets/images/Main_page_icon/link_icon/Facebook.png";
import Instagram from "../../assets/images/Main_page_icon/link_icon/Instagram.png";
import YouTube from "../../assets/images/Main_page_icon/link_icon/YouTube.png";
import Twitter from "../../assets/images/Main_page_icon/link_icon/Twitter.png";
import { Link } from "react-router-dom";
import "./Forgot_Password.css";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const handleResetPassword = async () => {
  try {
    const response = await fetch("http://localhost:3001/cashcalc/forgot/forgot_password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log(data);
      <p>Reset link is sent check email</p>
    } else {
      const text = await response.text();
      console.error("Unexpected response format. Content:", text);
      // Add logic to handle non-JSON response (e.g., show an error message)
    }
  } catch (error) {
    console.error("Error:", error.message);
    // Add logic to handle other errors (e.g., show an error message)
  }
};


  return (
    <div>
      <div className="forgotpass-page">
        <header className="forgotpass-header">
          <img src={Logo} alt="Logo" className="logo" />
          <h1 className="forgotpass-h1">CashCalC</h1>
        </header>
        <div className="chart">
          <img src={Croods_Chart} alt="Chart" />
        </div>
        <div className="forgotpass-container">
          <div className="forgotpass-box">
            <h2 className="forgotpass-h2">Reset Password</h2>
            <p>
              Enter the email address associated with your account and we'll
              send you a link to reset your password.
            </p>
            <div className="forgotpass-input">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
              />
            </div>
            <div>
              <button onClick={handleResetPassword}>
                Send Reset Password Email
              </button>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer">
        <div className="copyright">
          Copyright © 2023 CashCalC. All rights reserved. Terms of Use Privacy
          Policy
        </div>
        <div className="images">
          <img src={Facebook} alt="Facebook" />
          <img src={Instagram} alt="Instagram" />
          <img src={YouTube} alt="Youtube" />
          <img src={Twitter} alt="Twitter" />
        </div>
      </footer>
    </div>
  );
};

export default ForgotPassword;
