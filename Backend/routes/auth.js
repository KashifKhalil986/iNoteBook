const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser=require('../middleware/Fetchuser')

const JWTsecret = "kashifkhalilisagoodboy";
// Route 1
// create a user using POST /api/auth/createuser  no login required
router.post('/createuser', [
  check('name', 'Name should be at least 3 characters long').isLength({ min: 3 }),
  check('password', 'Password should be at least 8 characters long').isLength({ min: 8 }),
  check('email', 'Enter a valid email').isEmail()
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if the email already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Email already registered" });
    }
       let success=false;
    const salt = await bcrypt.genSalt(10);
    const secPassword = await bcrypt.hash(req.body.password,salt)
    // If email is not found, create a new user
    user = await User.create({
      name: req.body.name,
      password: secPassword,
      email: req.body.email
    });

    await user.save(); // Save the new user to the database
    const data ={
      user:{
        id:user.id
      }
    }
    const authtoken =jwt.sign(data,JWTsecret)
    success=true;
    res.json({success,authtoken});    // Return the newly created user object

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// Routh 2
// login a user using POST /api/auth/login  no login required
router.post('/login', [
  check('email', 'Enter a valid email').isEmail(),
  check('password', 'Password cannot be blank').exists()
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }
let success=false;
    // Compare the entered password with the hashed password in the database
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }

    // Generate JWT token
    const data = {
      user: {
        id: user.id
      }
    };
    const authtoken = jwt.sign(data, JWTsecret);
    success=true;
    // Return the auth token
    res.json({ success,authtoken });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});
// Routh 3
// login a user detail using POST /api/auth/getuser   login required
router.post('/getuser',fetchuser , async (req, res) => {
  try {
    const userid = req.user.id;
    const user = await User.findById(userid).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
  
})

module.exports = router;