//express
const express = require('express')
const app = express();
const port = 3000;
const path = require("path");
app.use(express.urlencoded({ extended: false }));
// const ejs = require('ejs');
app.engine('.html', require('ejs').__express); //tells Express to use EJS as the template engine for files with the .html extension
app.set('views', path.join(__dirname, 'views')); //sets the directory where Express will look for view files
app.set('view engine', 'html');// sets the default view engine to use when rendering views (In this case its set to html)
//Public Routes (css)
app.use(express.static(path.join(__dirname, 'public')));
//Socket
const http = require('http');
const socketIO = require('socket.io');
const server = http.createServer(app);
const io = socketIO(server);
// Attach the Socket.IO instance to the Express app
app.io = io;

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


server.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}/homepage`);
});