//express
const express = require('express')
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
app.use(express.urlencoded({ extended: false }));
// const ejs = require('ejs');
app.engine('.html', require('ejs').__express); //tells Express to use EJS as the template engine for files with the .html extension
app.set('views', path.join(__dirname, 'views')); //sets the directory where Express will look for view files
app.set('view engine', 'html');// sets the default view engine to use when rendering views (In this case its set to html)
//Public Routes (css)
app.use(express.static(path.join(__dirname, 'public')));
//Import express session middleware
const sessionMiddleware = require("./js/components/sessionMiddleware");
app.use(sessionMiddleware);

//Routes
const homepageRouter = require("./js/routes/homepage");
const signUpPageRouter = require("./js/routes/signuppage");
const loginPageRouter = require("./js/routes/loginpage");
const logOutPageRouter = require("./js/routes/logoutpage");
const chatPageRouter = require("./js/routes/chatpage");

app.use("/", homepageRouter);
app.use("/", loginPageRouter);
app.use("/", logOutPageRouter);
app.use("/", signUpPageRouter);
app.use("/", chatPageRouter);


//server mongoose
    const mongoose = require('mongoose');
    // Connect to MongoDB
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {}, console.log("connected to database"));
    //Catches mongodb connection error
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "mongo connection error"));
    //Import chatroom schema
    const ChatModel = require("./js/components/chatRoomSchemaModel");


//Socket IO
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const server = createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {}//temporarily store all the events that are sent by the server and will try to restore the state of a client when it reconnects
});


io.on('connection', async (socket) => {
    connectionStateRecovery: {}
    console.log(`user ${sessionMiddleware.username} connected`); //${socket.id.substring(0, 5)}
    const data = await ChatModel.find({}).exec();//if this doesn't work move inside enter room socket, remove async from io.on


    //Join room
    socket.on('enterRoom', async ({ username, room }) => {
        const chat = new ChatRoomModal({//Uploads to database
            room: room,
            messages:{ 
                username: username
                // message: msg
            }
        });
        const result = await chat.save();
        
        // Join the room
        data.forEach(data => {
            socket.join(data.room);
            console.log(`User ${data.username} has joined room ${data.room}`);
            // Optionally, send a confirmation back to the client
            socket.emit('message', `You have joined room ${data.room}`);
        });
    });


    //When a user connects (only to user)
    socket.emit('message', `Welcome to the chat!`)
    //When a user connects (to everyone but user)
    socket.broadcast.emit('message', `User ${sessionMiddleware.username} connected`); //${socket.id.substring(0, 5)}


    //Sending a message
    socket.on('chat message', async ({ msg, room, username }) => {// grabs submitted room and submitted message
        // Find the chat room by room name
        const chatRoom = await ChatModel.findOne({ room: room });

        if(chatRoom){
            chatRoom.messages.push({ username, message: msg });// adds messages and username to model
            await chatRoom.save(); // Save the updated chat room

            chatRoom.forEach(data => {
                io.to(data.room).emit('chat message', { msg: data.chat.message, username: data.chat.username });
            });
        }
        // io.to(room).emit('chat message', { msg, username }); // Broadcast the message to all connected clients
        console.log(`Sent message in room: ${room}. Msg: ${msg}`);
    });    


    //On disconnect
    socket.on('disconnect', function ({room, username}) {
        console.log(`User ${username} disconnected`);////socket.id.substring(0, 5)}
        //When a user disconnects (to everyone but user)
        socket.broadcast.to(room).emit('message', `User ${username} disconnected`);//socket.id.substring(0, 5)}
    });


    //Listens for activity (to everyone but user)
    socket.on('activity', ({ name, room }) => {//these name things might be uneccessary now
        socket.broadcast.to(room).emit('activity', name);
    });
})


    server.listen(port, () => {
        console.log(`Example app listening on port http://localhost:${port}/homepage`);
    });