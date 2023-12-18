import React from "react";
import Logo from "../../assets/images/Main_page_icon/Logo.png";
import Croods_Chart from "../../assets/images/Main_page_icon/Croods_Chart.png";
import Facebook from "../../assets/images/Main_page_icon/link_icon/Facebook.png";
import Instagram from "../../assets/images/Main_page_icon/link_icon/Instagram.png";
import YouTube from "../../assets/images/Main_page_icon/link_icon/YouTube.png";
import Twitter from "../../assets/images/Main_page_icon/link_icon/Twitter.png";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div>
      <div className="home-page">
        <header className="home-header">
          <img src={Logo} alt="Logo" className="logo" />
          <h1 className="home-h1">CashCalC</h1>
        </header>
        <div className="chart">
          <img src={Croods_Chart} alt="Chart" />
        </div>
        <div className="home-intro">
          <p>
            Unlock Your Financial Potential: Navigate Your Wealth Journey with
            Precision – Introducing CashCalC, Your Personal Finance Navigator!
          </p>
          <div className="home-signin-buttons">
            <Link to="/sign_in" className="home-signin-button">
              Sign In
            </Link>
            <Link to="/sign_up" className="home-signup-button">
              Sign Up
            </Link>
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

export default Home;
