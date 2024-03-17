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



const { createServer } = require('node:http');
const { Server } = require('socket.io');
const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log(`user ${socket.id.substring(0, 5)} connected`);
    //When a user connects (to everyone but user)
    socket.broadcast.emit('message', `User ${socket.id.substring(0, 5)} connected`);

    //When a user connects (only to user)
    socket.emit('message', 'Welcome to the chat room!')

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', function () {
        console.log(`User ${socket.id.substring(0, 5)} disconnected`);
        //When a user disconnects (to everyone but user)
        socket.broadcast.emit('message', `User ${socket.id.substring(0, 5)} disconnected`);
    });

    //Listens for activity (to everyone but user)
    socket.on('activity', (name) => {//these name things might be uneccessary now
        socket.broadcast.emit('activity', name);
    });
})


server.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}/homepage`);
});