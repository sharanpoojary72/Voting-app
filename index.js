const express = require('express');
const db = require('./config/db');
const path = require('path');
const ejs = require('ejs');
const session = require('express-session');
const bodyParser = require('body-parser');


const port = '3223'

const appRouter = require('./routers/auth');
const router = require('./routers/routes')

const app = express();
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

app.use(session({
    secret: 'your_secret_key',  // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }  // Set secure to true if using HTTPS
}));

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist')));

app.use(express.static(__dirname + '/public'));

// Assuming you are using a session or JWT for authentication
function checkAuthentication(req, res, next) {
    if (req.isAuthenticated || req.session.isLoggedIn) {
        // If the user is authenticated, proceed to the dashboard route
        return next();
    } else {
        // If not authenticated, redirect to login page
        return res.redirect('/login');
    }
}

app.use('/',appRouter);
app.use('/',checkAuthentication,router);


app.listen(port,()=>{
    console.log("Server Running on :");
    console.log(`http://localhost:${port}/`);
    
})
