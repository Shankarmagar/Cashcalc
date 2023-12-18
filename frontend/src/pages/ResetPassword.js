import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async () => {
    try {
      // Make a request to your backend to reset the password
      const response = await fetch(`http://localhost:3001/cashcalc/forgot/reset-password/${id}/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message);
        // Redirect to the login page or any other page
       navigate('/sign_in');
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Reset Your Password</h2>
      <label>New Password:</label>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleResetPassword}>Reset Password</button>
    </div>
  );
};

export default ResetPassword;
