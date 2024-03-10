const express = require('express')
// const app = express();
const signupPage = express.Router();
// Express session
require('dotenv').config();
// body parser
const bodyParser = require('body-parser');
signupPage.use(bodyParser.urlencoded({ extended: true }));
//server mongoose
const mongoose = require('mongoose');
//password hatcher
const bcryptjs = require('bcryptjs');

//Mongo/Mongoose stuff
    // Connect to MongoDB
    mongoose.connect('mongodb://localhost:27017/messaging-app', {
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
signupPage.use(sessionMiddleware);


signupPage.get("/sign-up-page", (req, res) => {
    if (req.session.loggedin) {
        // res.redirect('newBlogPage')  ============================Change this later=====================================
    } else {
        res.render('signUpPage', { emailExistError: emailExistError, errorMsg: "Email already exist", passwordErrorMsg: passwordErrorMsg });
    }
}); 


let emailExistError = false;
let passwordErrorMsg = "";
//Sign Up
    signupPage.post("/sign-up", async (req, res, next) => {//Post needs to be the same as the file page location
        try {   //Checks for unique password
                if (req.body.password != req.body.confirmPassword ) {
                    passwordErrorMsg = "Password and Confirm Password do not match";
                    res.redirect("sign-up-page");
                    return;
                } else if(req.body.password.search(/[a-z]/) < 0){
                    passwordErrorMsg = "Password must contain atleast one lowercase letter";
                    res.redirect("sign-up-page");
                    return;
                } else if (req.body.password.search(/[A-Z]/) < 0) {
                    passwordErrorMsg = "Password must contain atleast one upercase letter";
                    res.redirect("sign-up-page");
                    return;
                } else if (req.body.password.search(/[0-9]/) < 0) {
                    passwordErrorMsg = "Password must contain atleast one number";
                    res.redirect("sign-up-page");
                    return;
                }

            //Reset msg
            console.log("Password was entered correctly");
            passwordErrorMsg = "";

            const hashedPassword = await bcryptjs.hash(req.body.password, 13);
            //Stores inputed data into users constant
            const users = new UsersModel({
                email: req.body.email,
                password: hashedPassword
            });
                const usersEmail = await UsersModel.findOne({ email: req.body.email });
            if (!usersEmail) {
                    const result = await users.save();//Uploads users Data to database
                    console.log(result);
                    res.redirect("loginPage");
                    emailExistError = false;
                } else {
                    console.log("Error: Email already exist");
                    emailExistError = true;
                    res.redirect("sign-up-page");
                }
        } catch (err) {
            console.log("err");
            res.redirect("error");
            return next(err);
            };
    });

module.exports = signupPage;