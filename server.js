#!/usr/bin/env node

var express = require("express"),
    fs = require("fs"),
    https = require("https"),
    bodyParser = require("body-parser"),
    config = require("./config"),
    db = require("./db");

var app = express();

// Override port from third commandline argument, if present
if (process.argv && process.argv[2]) {
    config.APP_PORT = parseInt(process.argv[2]);
}

// Set useful globals
global.db = db,
global.libs = require("./api/libs"),
global.config = config,
global.approot = __dirname + "/";

// Configure application
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Register routes
app.use("/", require("./api"));

// Set https options
var https_options = {
  key: fs.readFileSync(config.SSL_KEY),
  cert: fs.readFileSync(config.SSL_CERT),
  passphrase: config.SSL_PASSPHRASE
};

// Start the server
https.createServer(https_options, app).listen(config.APP_PORT, config.APP_IP, function () {
    console.log("Starting secure Grouphone API server...");
    console.log("Listening on port %s:%d", config.APP_IP, config.APP_PORT);
});
