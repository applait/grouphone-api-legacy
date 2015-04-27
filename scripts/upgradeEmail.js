#!/usr/bin/env node

var request = require("request");
var config = require("../config");

global.config = config;
global.db = require("../db");

var mailerAPI = ["https://", config.APP_IP, ":", config.APP_PORT, "/mailer"].join(""),
    subject = "Grouphone has upgraded! Update your password now!";

var libs = require("../api/libs");

// Disable TLS authorization check so that we can use self-signed cert for the Grouphone API
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

libs.findUsers(function (err, users) {
  if (err) throw err;

  users.forEach(function (user) {

    libs.deactivateUser(user.email, function (err, token) {

      if (err) throw err;

      request.post(
        { url: mailerAPI,
          form: { email: user.email, subject: subject, data: { user: user, token: token },
                  template: "email/upgradesecurity" }},
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


});
