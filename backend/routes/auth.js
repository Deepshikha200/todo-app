const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const User = require('../model/user');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(200).json({ message: "User already exists" });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create and save the new user with hashed password
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();

    res.status(200).json({ user: newUser, message: " Signup succesfully" });
  } catch (error) {
    res.status(200).json({ message: "Internal server error" });
  }
});

//login 

// router.post('/login', async (req, res) => {
//   try {

//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//       return res.status(200).json({ message: "User not found please sign up first" });
//     }

//     const passwordMatch = await bcryptjs.compareSync(
//       req.body.password,
//       user.password);
//     if (!passwordMatch) {
//       return res.status(200).json({ message: "Invalid password" });
//     }

//     const { password, ...others } = user._doc;
//     res.status(200).json({ others });

//   } catch (error) {
//     res.status(200).json({ message: "Internal server error" });
//   }
// });

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).json({ message: "User not found please sign up first" });
    }

    const passwordMatch = await bcryptjs.compareSync(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(200).json({ message: "Invalid password" });
    }
    res.status(200).json({ userId: user._id });

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
