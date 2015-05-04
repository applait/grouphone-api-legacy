/**
 * Add users in a user list file to the DB
 */

var request = require("request"),
    config = require("../config"),
    db = require("../db");

var args = process.argv.slice(2),
    sendEmail = false,
    userAPI = ["https://", config.APP_IP, ":", config.APP_PORT, "/user/create"].join(""),
    count = 0,
    length = 0;

if (args[0] && parseInt(args[0]) === 1) {
  sendEmail = true;
  console.log("Sending emails for new accounts\n");
} else {
  sendEmail = false;
  console.log("Not sending emails for new accounts.\n***Pass `1` as argument to this script to send emails***\n");
}

// Disable TLS authorization check so that we can use self-signed cert for the Grouphone API
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

db.invites.find({}, { _id: 0 }).toArray(function (err, userlist) {

  length = userlist.length;

  if (userlist.length === 0) {
    console.log("No invites left to send.");
    return end();
  }

  // Start processing
  userlist.forEach(function (user) {
    request.post(
      { url: userAPI,
        form: { email: user.email, sendEmail: sendEmail, isInvite: true }},
      function (err, response, body) {
        if (!err && response.statusCode == 200) {
          body = JSON.parse(body);
          console.log("+ " + user.email + " created. Token: " + body.token);
          db.invites.remove({ "email": user.email }, function (err) {
            count++;
            if (err) console.log(err);
          });
        } else if (response.statusCode == 401) {
          console.log("x " + user.email + " already created.");
          db.invites.remove({ "email": user.email }, function (err) {
            count++;
            if (err) console.log(err);
          });
        } else {
          count++;
          console.log("x " + user.email + " could not be created.");
        }
      });

  });
  end();
});

var end = function () {
  if (count === length) {
    console.log("Done");
    db.mongo.close();
  } else {
    setTimeout(function () { end(); }, 1000);
  }
};
