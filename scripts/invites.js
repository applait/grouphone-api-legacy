#!/usr/bin/env node

var db = require("../db");

db.invites.find({}, { _id: 0 }).toArray(function (err, docs) {
  console.log("List of people on invite list:\n---------------------------------\n");
  docs.forEach(function (doc, i) {
    console.log("%d\t%s\t%s", i+1, doc.email, doc.timestamp.toString());
  });
  db.mongo.close();
});
