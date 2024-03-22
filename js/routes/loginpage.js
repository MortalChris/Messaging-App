//express
const express = require('express')
// const app = express();
const loginPage = express.Router();
//dotenv
require('dotenv').config();
// body parser
const bodyParser = require('body-parser');
loginPage.use(bodyParser.urlencoded({ extended: true }));
//server mongoose
const mongoose = require('mongoose');
//password hatcher
const bcryptjs = require('bcryptjs');


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
}, console.log("connected to database"));

//Catches mongodb connection error
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

//Schema for login details // Import Users Model
const UsersModel = require("../components/usersSchemaModel");

//Import express session middleware
const sessionMiddleware = require("../components/sessionMiddleware");
loginPage.use(sessionMiddleware);

//Route
loginPage.get("/login-page", (req, res) => {
    if (req.session.loggedin) {
        // res.redirect('newBlogPage')  ============================Change this later=====================================
    } else {
        res.render('loginPage');  
    }
});

// Log-in
loginPage.post("/loginPage", async function(req, res){ 
    try {
        const usersEmail = await UsersModel.findOne({ email: req.body.email });
        // console.log(usersEmail);
        if (usersEmail) { // check if the user exists 
            const comparePass = await bcryptjs.compare(req.body.password, usersEmail.password); //check if password matches 
            if (comparePass) { //if email and password matches logs in
                console.log(req.session)
                req.session.loggedin = true;
				req.session.username = usersEmail;
                // res.redirect("newBlogPage");  ============================Change this later=====================================
            } else {
                res.redirect("login-page");
                console.log("password doesn't match");
            }
        } else { //  if the user doesn't exist 
            res.redirect("login-page");
            console.log("User doesn't exist");
        }
    } catch (error) { 
        console.log(error)
        res.redirect("error");
    } 
}); 


module.exports = loginPage;