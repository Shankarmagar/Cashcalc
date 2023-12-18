// Layout.js
import React, { useState , useEffect} from "react";
import { Outlet, Link, Route, Routes, useNavigate } from "react-router-dom";
import "./Layout.css";

import profile from '../assets/images/Profile_Page_icon/Male User.png'
import dashbord from '../assets/images/Navbar_icon/DashBoard.png'
import getStarted from '../assets/images/Navbar_icon/Get_Started.png'
import profile2 from '../assets/images/Navbar_icon/Profile.png'
import budgetPlanning from '../assets/images/Navbar_icon/Budget_Planning.png';
import dropdown from '../assets/images/Navbar_icon/DropDown.png'

import BudgetPlanning from "./BudgetPlanning/BudgetPlanning";
import Dashboard from "./Dashboard/Dashboard";
import Profile from "./Profile_page/Profile"; 
import User_Data_Input from "./User_data_input/user_data_input";

import { useSelector } from "react-redux";
import { selectId } from "./redux/authSlice";
import { useDispatch } from 'react-redux';
import { fetchProfileImage } from './redux/profileImageSlice';


import {logout} from '../api/auth'

function Layout() {
  const { imageSrc, status, error } = useSelector((state) => state.profileImage);
  const Id = useSelector((state) => selectId(state));
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProfileImage(Id.toString()));
  }, [dispatch, Id.toString()]);

  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const showLogOut = () => {
    const logOutElement = document.querySelector('.LogOut');
    if (logOutElement) {
      logOutElement.style.visibility = 'visible';
    }
  };

  const handleLogout = async () => {
    console.log('Logout button clicked');
    try {
      const response = await logout(navigate);
      console.log(response);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  return (
    <div className="SideLayout">
      <nav>
        <div className="item1">
           <img src={imageSrc ? imageSrc : profile} className="image" alt="Profile"></img>
          Username
        </div>

        <div className="items">
          <Link to="/CashCalc/" className="linkName">Dashboard </Link>
          <img src={dashbord} alt="Dashboard" />
        </div>

        <div className="items">
          <Link to="/CashCalc/User_input" className="linkName">Get Started </Link>
          <img src={getStarted} alt="Dashboard" />
        </div>

        <div className="items">
          <Link to="/CashCalc/BudgetPlanning" className="linkName">Budget Planning </Link>
          <img src={budgetPlanning} alt="Budget Planning" />
        </div>

        <div className="items">
          <Link to="/CashCalc/Profile" className="linkName">Profile </Link>
          <img src={profile2} alt="Profile" />
        </div>

      </nav>
      <div className="MainPart">
       
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="BudgetPlanning" element={<BudgetPlanning />} />
          <Route path="Profile" element={<Profile />} />
          <Route path="User_input" element={<User_Data_Input/>} />

        </Routes>
      </div>
      <div className="logout">
        <img src={dropdown} alt="Logout" onClick={showLogOut} height="30px" width></img>
        <button className="LogOut" onClick={handleLogout}>Log out</button>
      </div>
    </div>
  );
}

export default Layout;