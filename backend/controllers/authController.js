// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

exports.signup = async (req, res) => {
    const { username, email, password } = req.body; 
    try {
        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already in use' });
        }

        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ 
            username, // Store the username in the database
            email, 
            password: hashedPassword 
        }); 
        res.status(201).json({ message: 'User registered successfully' });
    } 
    catch (error) {
        res.status(400).json({ message: 'Registration failed', error });
    }
};

exports.login = async (req, res) => {
    const { username, email, password } = req.body; // Access email from req.body
    try {
        console.log("Attempting to find user with email:", email); // Update log message
        const user = await User.findOne({ email }); // Search by email
        if (!user) {
            console.log("User not found");
            return res.status(401).json({ message: 'Incorrect email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password comparison result:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        console.log("Generating JWT token...");
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        console.log("Token generated successfully");
        res.json({ token, username: user.username }); 
    } 
    catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: 'Login failed', error });
    }
};
exports.getProfile = async (req, res) => {
    try {
      // Assuming you have the user ID in req.user from the protect middleware
      const userId = req.user.id;
  
      // Fetch user data from your database (excluding sensitive info like password)
      const user = await User.findById(userId).select('-password'); // Assuming you're using Mongoose
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    } 
    catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };