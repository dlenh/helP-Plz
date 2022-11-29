const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");

require("dotenv").config({path: "./config/env"})

require("./config/passport")(passport)

connectDB();

app.use(passport.initialize());
app.use(passport.session());

app.listen(process.env.PORT, () => {
    console.log("Server is running successfully!");
})