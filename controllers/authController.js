const bcrypt = require('bcrypt'); // Import bcrypt for hashing
const jwt = require('jsonwebtoken');

const userSchema = require('../models/userSchema');


const signUpGet = (req, res) => {
    res.render('signUp');
}

const signUpPost = async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);

    try {
        // Hash the password before saving
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user with the hashed password
        const user = new userSchema({ username, password: hashedPassword,voteStatus:false });
        await user.save();

        // Generate token only after successful user creation
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret'); // Replace 'your_jwt_secret' with your actual secret

        // Render the token and set up a delayed redirect in the view
        res.render('token', { token: token, error: null }); // Pass null for error
    } catch (error) {
        console.error(error); // Log the error for debugging

        // If there is an error, render the token view with an error message
        if (error.code === 11000) {  // Check for duplicate key error (username already exists)
            res.render('token', { token: null, error: "Username Already Exists." });
        } else {
            res.render('token', { token: null, error: error.message }); // Pass the error message
        }
    }
};


const loginGet = (req, res) => {
    res.render('login');
}


const loginPost = async (req, res) => {
    const { username, password } = req.body;
    try{
    // Find the user by username
    const user = await userSchema.findOne({ username });

    // Check if user exists
    if (!user) {
        return res.render('token', { token: null, error: "Username does not exist" });
    }

    // Compare the input password with the stored hashed password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    // If password does not match
    if (!isMatch) {
        return res.render('token', { token: null, error: "Invalid Credentials" });
    }

    // Save user details in session after successful login
    console.log(req.sessionID);
    console.log(req.session);
    
    req.session.isLoggedIn = true;
    req.session.user = { username: user.username };
    req.session.userId = user._id;
    // If successful, redirect to the home page
    if (username === 'admin' && password === 'admin') {
        // Set session for admin
        res.redirect('/admin');
    } else {
        res.redirect('/dashboard');
        
    }
    } catch (error) {
        return res.render('token', { token: null, error: error });
    }
    
};

const logOut = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.render('token', { token: null, error: 'Failed to log out' });
        }
        res.redirect('/login');  // Redirect to login page after logout
        console.log('Session Destroyed');
        
    });
}

module.exports = { signUpGet, signUpPost, loginGet, loginPost, logOut };