/**
 * Adapter to different storage units
 */

var levelup = require("levelup"),
    config = require("./config"),
    mongo = require("mongoskin").db(config.MONGO_URL);

module.exports = {
    invites: levelup("./storage/invites.db", {
        keyEncoding: "json",
        valueEncoding: "json"
    }),
    activations: mongo.collection("activations"),
    accounts: mongo.collection("accounts"),
    sessions: mongo.collection("sessions"),
    mongo: mongo
};
