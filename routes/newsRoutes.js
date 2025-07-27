

const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();
router.use(express.json()); 
const { getNewsArticles } = require('../controller/newsController')


const authorisationMiddleware = (req, res, next) => {
    const headers = req.headers || {};
    const token = headers.authorization;

    //Token missing implemented in middleware
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
router.get('/news', [authorisationMiddleware], getNewsArticles)

module.exports = router