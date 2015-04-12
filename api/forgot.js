/**
 * Handle client-rasied forgot password requests
 */

var router = require("express").Router();

// API to handle forgot password requests from clients
// Expects username in request body
router.post("/", function (req, res) {

  // API looks up on database for the user
  libs.findUser(req.body.email, function (err, user) {

    if (err) {
      return res.status(500).json({
        error: error,
        message: "DB operation failed"
      });
    }

    // If the user is found for the email
    if (user) {

      // Run the deactivation routines
      libs.deactivateUser(user.email, function (err, token) {
        if (err) {
          return res.status(500).json({
            error: error,
            message: "DB operation failed"
          });
        }

        res.render("email/forgot", { email: user.email, token: token }, function (err, html) {
          if (err) return console.log(err);
          libs.sendEmail({ html: html, subject: "Reset your Grouphone password", email: user.email });
        });
        return res.status(200).json({ email: user.email, token: token });
      });
    }

    // If the user doesn't exist, send fail message
    else res.status(200).json({
      error: {},
      message: "Couldn't find the user."
    });
  });
});

module.exports = router;
