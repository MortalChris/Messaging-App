const session = require('express-session');
require('dotenv').config()

//Express session middleware that will be used to store username temporary for maxAge seconds
const sessionMiddleware = session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    maxAge: 3600000,
});

module.exports = sessionMiddleware;