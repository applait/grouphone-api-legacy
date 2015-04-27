/**
 * Add users in a user list file to the DB
 */

var fs = require("fs"),
    path = require("path"),
    request = require("request"),
    config = require("../config");

var args = process.argv.slice(2),
    sendEmail = false,
    userAPI = ["https://", config.APP_IP, ":", config.APP_PORT, "/user/create"].join("");

if (!args || !args[0]) {
    console.log("Provide path to user list JSON file. e.g.");
    console.log("\n  $ node scripts/addUsers.js storage/beta-invites.json");
    process.exit(1);
}

try {
  var userlist = JSON.parse(fs.readFileSync(path.resolve(args[0])));
} catch (e) {
  console.log("Invalid JSON file provided.");
  process.exit(1);
}

if (!userlist.emails || !userlist.count) {
  console.log("User list file needs to be in the format:\n");
  console.log("  { 'emails': [], 'count': 0 }");
  process.exit(1);
}

if (args[1] && parseInt(args[1]) === 1) {
  sendEmail = true;
}

// Start processing
userlist.emails.forEach(function (email) {

  request.post(
    { url: userAPI,
      form: { email: email, sendEmail: sendEmail, isInvite: true }},
    function (err, response, body) {
      if (!err && response.statusCode == 200) {
        body = JSON.parse(body);
        console.log("+ " + email + " created. Token: " + body.token);
      } else if (response.statusCode == 401) {
        console.log("x " + email + " already created.");
      } else {
        console.log("x " + email + " could not be created.");
      }
    });

});
