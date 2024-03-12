//express
const express = require('express');
//
const chatPage = express.Router();
// body parser
const bodyParser = require('body-parser');
chatPage.use(bodyParser.urlencoded({ extended: true }));
//server mongoose
const mongoose = require('mongoose');
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/messaging-app', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
}, console.log("connected to database"));
//Catches mongodb connection error
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));


//Route
chatPage.get("/chat-page", (req, res) => {

    res.render('chatpage');
    // if (req.session.loggedin) {
    //     res.render('chat-page');
    // } else {
    //     res.redirect('homepage');
    // }
});

module.exports = chatPage;