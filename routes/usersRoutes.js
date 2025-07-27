const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();
router.use(express.json());

const { registerUser, loginUser,getListofPreferences,modifyPreferences,getNewsArticles} = require('../controller/usersController')




//JWT MIDDLEWARE to AUTHORIZE users for secured apis
const authorisationMiddleware = (req, res, next) => {
    const headers = req.headers || {};
    console.log(headers)
    const token = headers.authorization;

    //Token missing implemented in the middleware
    if (!token) {
        return res.status(401).send({"message": "Token not found"});
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
        return res.status(401).send({message: "Invalid Token"});
    }

    req.user = decodedToken;
    next();
}

//Step 2
router.post('/signup', registerUser) //Register a new User 
router.post('/login', loginUser) // Login of existing user

//Step 3
router.get('/preferences', [authorisationMiddleware], getListofPreferences) // Get the list of preferences for the logged in user
router.put('/preferences', [authorisationMiddleware], modifyPreferences) // Update teh preferences for a user

//Step 4
 // get news articles 

module.exports = router;