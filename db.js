/**
 * Adapter to different storage units
 */

var config = require("./config"),
    mongo = require("mongoskin").db(config.MONGO_URL);

module.exports = {
  activations: mongo.collection("activations"),
  accounts: mongo.collection("accounts"),
  sessions: mongo.collection("sessions"),
  mongo: mongo
};
