#!/usr/bin/env node

var db = require("../db"),
    count = 0;

db.invites.createReadStream().on("data", function (data) {
    count++;
    console.log("-", data.key);
}).on("end", function () {
    console.log("Total invites:" + count);
});

