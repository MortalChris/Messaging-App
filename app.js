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
        // Check if the room exists
        let chatRoom = await ChatModel.findOne({ roomId: room }).exec();
        if(!chatRoom){//If chatRoom doesnt exist make one
            const chat = new ChatModel({//Uploads to database
                room: room,
                chat:{ 
                    sender: username,
                    messages: []
                }
            });
            await chat.save();
        }

        // Join the room
        // data.forEach(data => {
            socket.join(room);//data.room
            console.log(`User ${data.sender} has joined room ${room}`);//data.room
            // Optionally, send a confirmation back to the client
            socket.emit('message', `You have joined room ${room}`);//data.room
        // });
    });

    //When a user connects (only to user)
    socket.emit('message', `Welcome to the chat!`)

    //When a user connects (to everyone but user)
    socket.broadcast.emit('message', `User ${sessionMiddleware.username} connected`); //${socket.id.substring(0, 5)}


    //Sending a message
    socket.on('chat message', async ({ msg, room, username }) => {// grabs submitted room and submitted message

        const findRoom = await ChatModel.findOne({ roomId: room });
        console.log("findRoom = " + findRoom)
        try {
            if(findRoom){
                //Adds messages to array object
                findRoom.chat.push({ sender: username, messages: msg, timestamp: new Date() });
                await chatRoom.save();
                console.log(findRoom);
                // data.forEach(data => {
                //     io.to(data.room).emit('chat message', { msg: data.msg, sender: data.sender });
                // });
            }
        } catch {
            console.log("An error has occured with submitting room")
        }

        io.to(room).emit('chat message', { msg, username }); // Broadcast the message to all connected clients
        console.log(`Sent message in room: ${room}. Msg: ${msg}`);
    });    


    socket.on('user disconnect', function ({room, username}) {
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