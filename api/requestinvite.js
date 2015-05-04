/**
 * API request invite module
 *
 * Request invites module
 */

var router = require("express").Router();

router.post("/:email", function (req, res) {

  if (!config.ACCEPT_INVITATION) {
    return res.status(403).json({ "message": "Invitations are closed now.", "status": 403 });
  }

  if (req.hostname !== config.HOSTNAME) {
    return res.status(403).json({ "message": "Not you. Yes, YOU. NOT you.", "status": 403 });
  }
  // Look for the `name` query parameter
  var email = req.params && req.params.email && req.params.email.trim();

  if (!email) {
    return res.status(401).json({ "message": "Need `email` as a query parameter.", "status": 401 });
  }

  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) !== true) {
    return res.status(401).json({ "message": "Need a valid email address.", "status": 401 });
  }

  // Check if email already exists
  libs.findUser(email, function (err, doc) {
    if (err) {
      // Return error if db lookup fails
      return res.status(500).json({
        error: err,
        message: "DB operation failed"
      });
    }
    // If email already exists, let them know
    if (doc !== null) {
      return res.status(200).json({
        "message": "You already have an account with us! Try logging in!",
        "status": 200
      });
    } else {
      db.invites.findOne({ email: email }, function (err, doc) {
        if (doc !== null) {
          return res.status(200).json({
            "message": "You are already in the invite queue! Wait for the invitation!",
            "status": 200
          });
        }

        // Email does not exist yet. So add invite
        db.invites.insert({ email: email, timestamp: new Date() }, function (err) {
          return res.status(200).json({
            "message": "You have been added to the invitation queue! Wait for the invitation!",
            "status": 200
          });
        });
      });
    }
  });
});

module.exports = router;
