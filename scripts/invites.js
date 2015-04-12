#!/usr/bin/env node

var db = require("../db"),
    count = 0,
    emails = [];

db.invites.createReadStream().on("data", function (data) {
  count++;
  emails.push(data.key);
}).on("end", function () {
  console.log(JSON.stringify({ "emails": emails, "count": count }, null, 2));
});
