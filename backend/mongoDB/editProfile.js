const express = require("express");
const userData = require("./userSchema.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { default: mongoose } = require("mongoose");
const handleImageUpload = require('../middleware/uploadMiddleware.js');


const router = express.Router();

// Update profile name
router.put('/update-profile-name/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { newName } = req.body;

    const user = await userData.findByIdAndUpdate(id, { name: newName }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile name updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update password
router.put('/update-passwordAndEmail/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword, newEmail } = req.body;
   // Generate a salt with a specified number of rounds (e.g., 10)
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    const updatedUser = await userData.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the new email is already in use
    const existingUserWithEmail = await userData.findOne({ email: newEmail });

    if (existingUserWithEmail && existingUserWithEmail._id.toString() !== id) {
      return res.status(409).json({ message: 'This email address is already in use.' });
    }

    // Update email
    const userWithUpdatedEmail = await userData.findByIdAndUpdate(id, { email: newEmail }, { new: true });

    if (!userWithUpdatedEmail) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Password and email updated successfully', user: userWithUpdatedEmail });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/uploadImage/:id', handleImageUpload, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userData.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const imageData = req.file.buffer;
    const contentType = req.file.mimetype;

    // Check if the user already has a profile image
    if (user.profileImage) {
      // If yes, update the existing image
      user.profileImage.data = imageData;
      user.profileImage.contentType = contentType;
    } else {
      // If no, create a new profile image field
      user.profileImage = {
        data: imageData,
        contentType: contentType,
      };
    }

    await user.save();

    res.status(200).json({ message: 'Image uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/getProfileImage/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userData.findById(userId);

    if (!user || !user.profileImage) {
      return res.send(null);
    }

    const imageData = user.profileImage.data;
    if(!imageData)
    {
      return res.send(null);
    }
    const contentType = user.profileImage.contentType;

    res.set('Content-Type', contentType);
    res.send(imageData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;