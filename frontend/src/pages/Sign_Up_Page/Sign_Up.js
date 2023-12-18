import React, { useState } from "react";
import Logo from "../../assets/images/Main_page_icon/Logo.png";
import Facebook from "../../assets/images/Main_page_icon/link_icon/Facebook.png";
import Instagram from "../../assets/images/Main_page_icon/link_icon/Instagram.png";
import YouTube from "../../assets/images/Main_page_icon/link_icon/YouTube.png";
import Twitter from "../../assets/images/Main_page_icon/link_icon/Twitter.png";
import Croods_Chart from "../../assets/images/Main_page_icon/Croods_Chart.png";
import Google from "../../assets/images/sign_Up_icon/Google.png";
import Apple from "../../assets/images/sign_Up_icon/apple.png";
import { Link } from "react-router-dom";
import "./Sign_Up.css";
import { signUp } from '../../../src/api/auth';


const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    console.log("Signing up...");
    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
    // Handle sign-up logic here

    try {
      const userData = {
        email,
        password,
        name: `${firstName} ${lastName}`,
      };

      const response = await signUp(userData);
      console.log('Registration Successful:', response);

      // You can redirect to another page or perform any action on successful registration
    } catch (error) {
      console.error('Registration Error:', error);
      // Handle registration error (e.g., show an error message to the user)
    }
  };

  return (
    <div>
      <div className="signup-page">
        <header className="signup-header">
          <img src={Logo} alt="Logo" className="logo" />
          <h1 className="signup-h1">CashCalC</h1>
        </header>
        <div className="chart">
          <img src={Croods_Chart} alt="Chart" />
        </div>
        <div className="signup-container">
          <div className="signup-box">
            <h2 className="signup-h2">Sign Up</h2>
            <div className="third-party-signup">
              <div className="signup-buttons">
                <Link to="/google_auth">
                  <button className="google-button">
                    <img src={Google} alt="Google Logo" />
                    Sign Up with Google
                  </button>
                </Link>
                <Link to="/apple_auth">
                  <button className="apple-button">
                    <img src={Apple} alt="Apple Logo" />
                    Sign Up with Apple
                  </button>
                </Link>
              </div>
              <p>Or Sign Up With:</p>
            </div>
            <div className="signup-input">
              <span>First Name</span>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
              />
            </div>
            <div className="signup-input">
              <span>Last Name</span>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
              />
            </div>
            <div className="signup-input">
              <span>Email Address</span>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@example.com"
              />
            </div>
            <div className="signup-input">
              <span>Create Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
              />
            </div>
            <div className="signup-input">
              <span>Confirm Password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div>
              <button onClick={handleSignUp}>Sign Up</button>
            </div>
            <div className="go-to-login">
              <Link to="/sign_in" className="go-login">
                Already have an account? Sign In Here
              </Link>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer">
        <div className="copyright">
          Copyright © 2023 CashCalC. All rights reserved.
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

export default SignUp;
