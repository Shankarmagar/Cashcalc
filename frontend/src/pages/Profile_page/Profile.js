import axios from 'axios';
import React, { useState , useEffect} from "react";
import "./Profile.css";
import profile from "../../assets/images/Profile_Page_icon/Male User.png";
import image1 from "../../assets/images/Profile_Page_icon/photo.png";
import edit from "../../assets/images/Profile_Page_icon/Edit.png";

import { useUpdateUsernameMutation } from "../redux/apiSlice";
import { useSelector } from "react-redux";
import { selectId } from "../redux/authSlice";
import { useDispatch } from 'react-redux';
import { useUpdateEmailAndPasswordMutation } from "../redux/apiSlice";
import { fetchProfileImage } from '../redux/profileImageSlice';
import { useGetShowUserDetailsQuery } from '../redux/userAccountInfoSlice'


const Profile = () => {
  const [condition, setCondition] = useState("none");
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [image, setImage] = useState("");
  const [displayUserName, setDisplayUsername] = useState("");
  const [displayUserEmail, setDisplayUserEmail]= useState("");
  const [displayPasswordInasterisk, setDisplayPasswordInAsterisk] = useState("");




  const Id = useSelector((state) => selectId(state)); // Use useSelector to get the current state  
  const dispatch = useDispatch();

  const [ mutate ] = useUpdateUsernameMutation(); // Destructure the mutate function
  const [mutate2] = useUpdateEmailAndPasswordMutation();
  const { imageSrc, status, error } = useSelector((state) => state.profileImage);
  const { userDetails } = useSelector ((state) => state.userAccountInfo);

    useEffect(() => {
    dispatch(fetchProfileImage(Id.toString()));  
  }, [dispatch, Id.toString()]);

    useEffect(() => {
  dispatch(useGetShowUserDetailsQuery(Id.toString()));
  if (userDetails) {
    setDisplayUsername(userDetails.name);
    setDisplayUserEmail(userDetails.email);
    setDisplayPasswordInAsterisk(userDetails.password_length);
  }
}, [userDetails]);


  


 const handleUpdateUsername = async () => {
    try {
      console.log('My Id rn', Id.toString());
      const stringId = Id.toString();
      console.log(stringId);
      const newName = newUsername;
      await mutate({Id: stringId, newName: {newName} });
      alert("Your username has been updated!");
      hideForm();
    } catch (error) {
      console.error(error);
    }
  };

  const UpdateEmailAndPassword = async () => {
    if (!newEmail || !newPassword ) return alert("Please fill out all fields.");
    else{
      try {
        const data = { newPassword : newPassword, newEmail : newEmail };
        const stringId = Id.toString();
        await mutate2({Id: stringId, data: data});
        hideForm();
      }catch(error)
      {
        console.error(error);
      }
      
    }

  };

  const handleImageUpload = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("image", image);

  try {
    const result = await axios.post(
      `http://localhost:3001/cashcalc/edit/uploadImage/${Id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    // After a successful upload, dispatch fetchProfileImage to update the image in the Redux store
    await dispatch(fetchProfileImage(Id.toString()));

    // After fetching the updated image, hide the form
    hideForm();
  } catch (error) {
    console.error(error);
    // Handle the error as needed
  }
};



const onInputChange = (e) => {
  console.log(e.target.files[0]);
  setImage(e.target.files[0]);
};


  const hideForm = () => {
    document.querySelector('.FormPart').style.visibility = 'hidden';
  };

  const ShowUpdateImageForm = () => {
    document.querySelector('.FormPart').style.visibility = 'initial';
    document.querySelector('.FormPart').style.marginTop = '-30%';

    setCondition('ShowUpdatePhotoForm');
  };

  const ShowUpdateUsernameForm = () => {
    document.querySelector('.FormPart').style.visibility = 'initial';
    setCondition('ShowUpdateUsernameForm');
  };

  const ShowUpdatAccountInformationForm = () => {
    document.querySelector('.FormPart').style.visibility = 'initial';
    document.querySelector('.FormPart').style.marginTop = '-40%';

    setCondition('ShowUpdateAccountInformationForm');
  };
  return (
    <div className="profile-page">
      <h2>Profile</h2>
      <div className="ContentPart">
        <div className="Personal_info">
          <div className="image-container">  
          <img src={imageSrc ? imageSrc :profile} className="image1" alt='Upload Profile' width="200" height="200"></img>
          
          
            <img
              src={image1}
              className="image2"
              alt="Image"
              onClick={ShowUpdateImageForm}
            ></img>
          </div>
          <div className="detail">
            {displayUserName}
            <img
              className="edit"
              src={edit}
              width="24px"
              height="24px"
              alt="Edit"
              onClick={ShowUpdateUsernameForm}
            ></img>
          </div>
        </div>

        <div className="account_information">
          <div className="headPart">
            Account Information
            <img
              className="edit_accountInformation"
              src={edit}
              width="24px"
              height="24px"
              alt="Edit Account Information"
              onClick={ShowUpdatAccountInformationForm}
            ></img>
          </div>
          <div className="info">
            <div className="items">Email</div>
            <div className="items">{displayUserEmail}</div>
            <div className="items">Password</div>
           <div className="items">
          {Array(displayPasswordInasterisk).fill('*').join('')}
           </div>

          </div>
        </div>
      </div>
      <div className="FormPart">
        {condition === "ShowUpdatePhotoForm" && (
          <div className="update-photo">
            <div className="space">
              <label htmlFor="fileInput" className="custom-file-upload">
                Choose file
              </label>
              <input 
              type="file" 
              id="fileInput" 
              name="image"
              onChange={onInputChange}/>
            </div>
            <div className="upload_section">
              <div className="Upload" onClick={handleImageUpload}>Upload</div>
              <div className="Cancel" onClick={hideForm}>
                Cancel
              </div>
            </div>
          </div>
        )}
        {condition === 'ShowUpdateUsernameForm' && (
          <div className="update-Username">
            <div className="contents">
              <span>New Username</span>
              <input 
              className="space username"
              value= {newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="New Username"
              ></input>
              <div className="upload_section">
              <div className="Upload" onClick={handleUpdateUsername}>Save</div>
                <div className="Cancel" onClick={hideForm}>
                  Cancel
                </div>
              </div>
            </div>
          </div>
        )}
        {condition === "ShowUpdateAccountInformationForm" && (
            <div className="update-accountInformation">
          <div className="contents">
              <span>New Email</span>
              <input 
              className="space Email"
             placeholder=""
              onChange={(e) => setNewEmail(e.target.value)}></input>
              <span>New Password</span>
              <input 
              type='password' 
              className="space NewPassword"
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder=""></input>
              <span>Retype Password</span>
              <input type='password' className="space retypePassword"></input>
              <div className="upload_section">
                <div className="Upload" onClick={UpdateEmailAndPassword}>Save</div>
                <div className="Cancel" onClick={hideForm}>
                  Cancel
                </div>
              </div>
            </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

