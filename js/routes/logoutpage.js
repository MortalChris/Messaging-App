//express
const express = require('express')
// const app = express();
const logOutPage = express.Router();
const sessionMiddleware = require("../components/sessionMiddleware");
logOutPage.use(sessionMiddleware);

logOutPage.get("/logout-page", (req, res) => {
    if (req.session.loggedin) {
        res.render('logOutPage');
    } else {
        res.redirect('homepage');
    }
});

logOutPage.post("/logOutPage", async function (req, res) { 
    req.session.loggedin = false;
    req.session.username = "";
    res.redirect("logout-page");
    console.log("Successfully Logged out");
    console.log(req.session.loggedin);
})


module.exports = logOutPage;