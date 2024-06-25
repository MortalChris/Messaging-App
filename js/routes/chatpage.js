//express
const express = require('express');
//
const chatPage = express.Router();
// body parser
const bodyParser = require('body-parser');
chatPage.use(bodyParser.urlencoded({ extended: true }));
//dotenv
require('dotenv').config()


//server mongoose
    const mongoose = require('mongoose');
    // Connect to MongoDB
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true
    }, console.log("connected to database"));
    //Catches mongodb connection error
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "mongo connection error"));

//Import express session middleware
const sessionMiddleware = require("../components/sessionMiddleware");
chatPage.use(sessionMiddleware);

//Import chatroom schema
const ChatModel = require("../components/chatRoomSchemaModel");


//Route
chatPage.get("/chat-page", async (req, res) => {
    try {
        //Using model it finds the data in mongodb
        const chatRoom = await ChatModel.find({}).exec();
        // data is an array of objects, not a single object!
        res.render('chatpage', {
            chatRoom: chatRoom ,
            userName: "sessionMiddleware.username" //Might need to remove this later
        });
        // if (req.session.loggedin) {
        // res.render('chatpage', {
        //     data: data
        // });
        // } else {
        //     res.redirect('homepage');
        // }
    } catch (err) {
        console.error('Error fetching data from MongoDB:', err);
        res.status(500).send('Internal Server Error');
    }

});
//create seperate post for room input

// chatPage.post("/room", async (req, res, next) => {
//     //checks if it already exist
//     let chatRoom = await ChatModel.findOne({ room: req.body.roomName }).exec();
//     //if it doesn't create object and save
//     if (!chatRoom) {//If chatRoom doesnt exist make one
//         const chat = new ChatModel({//Uploads to database
//             room: req.body.roomName,
//             chat: {
//                 sender: "sessionMiddleware.username",
//                 messages: []
//             }
//         });
//         await chat.save();
//         res.status(204).send();
//     }
// })


chatPage.post("/chat", async (req, res, next) => { 
    let chatRoom = await ChatModel.findOne({ room: req.body.roomName }).exec();
    if (!chatRoom) {
        const chat = new ChatModel({
            room: "room1",
            chat: [{
                sender: "sessionMiddleware.username",
                messages: req.body.message,
                timestamp: new Date()
            }]
        })
        const result = await chat.save();
        res.redirect("chat-page");
    } else {
        console.log("FUCKING HELL");
    }

    // try {
    //             if(chatRoom){
    //                 //Adds messages to array object
    //                 chatRoom.chat.push({ sender: "sessionMiddleware.username", messages: req.body.message, timestamp: new Date() });
    //                 await chatRoom.save();
    //                 res.redirect("chat-page");
    //                 console.log(chatRoom);
    //             }
    //         } catch {
    //             res.status(404).send();
    //             console.log("An error has occured with submitting room")
    //         }
});


// chatPage.post("/chat", async (req, res, next) => {           //might need to removed
//     const messages = new ChatModel({
//         // email: req.session.username.email,
//         message: req.body.message
//     });
//     const result = await messages.save();
//     res.redirect("chat-page");
// });


module.exports = chatPage;