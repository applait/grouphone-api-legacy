#!/usr/bin/env node

var db = require("../db");

var accounts = [
    {
        "email": "hello1@example.com",
        "password": "asij8cj23ijaimicm3iiq8j39jaimscmim",
        "isActive": true
    },
    {
        "email": "hello2@example.com",
        "password": "asij8cj23ijaimicm3iiq8j39jaimscmim",
        "isActive": true
    },
    {
        "email": "hello3@example.com",
        "password": "asij8cj23ijaimicm3iiq8j39jaimscmim",
        "isActive": false
    },
    {
        "email": "hello4@example.com",
        "password": "asij8cj23ijaimicm3iiq8j39jaimscmim",
        "isActive": false
    }
];

var activations = [
    {
        "email": "hello3@example.com",
        "token": "asjonmc8jh83j8miwamismcsamc333asa"
    },
    {
        "email": "hello4@example.com",
        "token": "asj344c8#3$%j8miwamismcsamc333asa"
    }
];

var sessions = [
    {
        "email": "hello1@example.com",
        "sessions": {
            "a8usd8u3i": { id: "a8usd8u3i", client: "grouphone.me" }
        }
    },
    {
        "email": "hello2@example.com",
        "sessions": {
            "31312asaa": { id: "31312asaa", client: "grouphone.me" },
            "31312as34": { id: "31312as34", client: "grouphone.me" },
            "31312as56": { id: "31312as56", client: "grouphone.me" }
        }
    }
];

db.accounts.insert(accounts, function (err) {
    if (err) {
        console.error("Unable to populate accounts");
        return;
    }
    console.log("Dummy accounts created");

    db.activations.insert(activations, function (err) {
        if (err) {
            console.error("Unable to populate activations");
            return;
        }
        console.log("Dummy activations created");

        db.sessions.insert(sessions, function (err) {
            if (err) {
                console.error("Unable to populate sessions");
                return;
            }
            console.log("Dummy sessions created");
            db.mongo.close();
        });
    });
});

