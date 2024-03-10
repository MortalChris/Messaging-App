//express
const express = require('express')
// const app = express();
const logOutPage = express.Router();
const sessionMiddleware = require("./sessionMiddleware");
logOutPage.use(sessionMiddleware);

logOutPage.get("/logout-page", (req, res) => {
    res.render('logOutPage');
});

logOutPage.post("/logOutPage", async function (req, res) { 
    req.session.loggedin = false;
    req.session.username = "";
    res.redirect("logout-page");
    console.log(req.session.loggedin);
})


module.exports = logOutPage;