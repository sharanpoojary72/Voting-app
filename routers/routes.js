const express = require('express');

const {adminData,showData,resultData,updateVotes, resetVotes} = require('../controllers/dataController')

const router = express();

const isAuthenticatedAsAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.username === 'admin') {
        return next(); // User is authenticated as admin, proceed to next middleware or route
    } else {
        return res.status(403).send('Access Denied. Admins Only.');
    }
};

router.get('/admin',isAuthenticatedAsAdmin,adminData);

router.get('/dashboard',showData);

router.post('/votes/:id',updateVotes);

router.get('/results',resultData);


router.post('/reset',resetVotes)

module.exports = router;