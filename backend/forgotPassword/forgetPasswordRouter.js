const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const userData = require('../mongoDB/userSchema'); 

router.post('/forgot_password', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user with the provided email exists
    const user = await userData.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a unique reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Set the reset token and expiration time in the user document
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    // Save the user with the new reset token
    await user.save();

    // Send reset email with the token link
    const resetLink = `${process.env.reset_uri}/reset-password/${user._id}/${resetToken}`;
    sendResetEmail(user.email, resetLink);

    res.json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: 'Error generating reset token' });
  }
});

// Function to send reset email
const sendResetEmail = (to, link) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'shankaralemagar91@gmail.com', 
      pass: process.env.My_gmail_password, 
    },
  });

  const mailOptions = {
    from: 'shankaralemagar91@gmail.com',
    to,
    subject: 'Password Reset',
    html: `
      <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
      <p>Please click on the following link, or paste this into your browser to complete the process:</p>
      <a href="${link}">${link}</a>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Email sending error: ${error}`);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};

router.post('/reset-password/:id/:token', async (req, res) => {
  const { id, token } = req.params;
  const { newPassword } = req.body;

  try {
    // Find the user by ID
    const user = await userData.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the reset token
    const secret = process.env.SECRET_KEY + user.password;
    const decoded = jwt.verify(token, secret);

    // Check if the token is valid
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    user.resetPasswordToken = null; // Clear the reset token
    user.resetPasswordExpires = null; // Clear the expiration time

    // Save the updated user
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: 'Error resetting password' });
  }
});
router.get('/reset-password/:id/:token', async (req, res) => {
  const { id, token } = req.params;


  try {
    // Find the user by ID
    const user = await userData.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the reset token
    const secret = process.env.SECRET_KEY + user.password;
    const decoded = jwt.verify(token, secret);

    // Check if the token is valid
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

   res.render("index", {email: verify.email});
   res.send('verified');
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

module.exports = router;

