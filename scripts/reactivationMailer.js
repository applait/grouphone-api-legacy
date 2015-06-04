#!/usr/bin/env node

/**
 * Send reactivation email for accounts that have not been activated yet
 */

var request = require("request");
var config = require("../config");

global.config = config;
global.db = require("../db");

var mailerAPI = ["https://", config.APP_IP, ":", config.APP_PORT, "/mailer"].join(""),
    subject = "Activate your Grouphone account. We're waiting for you!";

var libs = require("../api/libs");

// Disable TLS authorization check so that we can use self-signed cert for the Grouphone API
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

db.activations.find().toArray(function (err, users) {
  if (err) throw err;

  if (users.length < 1) {
    console.log("No inactive users found.");
    process.exit();
  }

  users.forEach(function (user) {

    request.post(
      { url: mailerAPI,
        form: { email: user.email, subject: subject, data: { user: user },
                template: "email/reactivate" }},
      function (err, response, body) {
        if (!err && response.statusCode == 200) {
          body = JSON.parse(body);
          console.log("+ " + body.message);
        } else {
          body = JSON.parse(body);
          console.error(body.message);
          console.log("x Unable to send mailer to " + user.email);
        }
      });

  });


});
