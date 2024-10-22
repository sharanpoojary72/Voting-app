const express = require('express');


const router = express();

const authControllers = require('../controllers/authController');

router.get('/login', authControllers.loginGet)

router.post('/login', authControllers.loginPost);

router.get('/signup', authControllers.signUpGet)


router.post('/signup', authControllers.signUpPost);

router.get('/logout', authControllers.logOut);


module.exports = router;