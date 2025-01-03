// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Make sure it's required and unique
    // Change username to email
    email: { 
        type: String, 
        required: true, 
        unique: true,
        // Add email validation
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/ 
    },
    password: { type: String, required: true },
});

// ... (rest of the code remains the same)

module.exports = mongoose.model('User', userSchema);
