const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");

// use .evn file in config folder
require("dotenv").config({path: "./config/env"})

// passport config
require("./config/passport")(passport)

// connect to database
connectDB();

// using EJS for views
app.set("view engine", "ejs");

// static folder
app.use(express.static("public"));

// body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// logging using morgan
app.use(logger("dev"));

// use forms for put/delete methods
app.use(methodOverride("_method"));

// set up sessions which are stored in MongoDB
app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// use flash messages for errors
app.use(flash());

// server running
app.listen(process.env.PORT, () => {
    console.log("Server is running successfully!");
})