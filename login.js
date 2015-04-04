/**
 * API to handle user logins
 */

var router = require("express").Router();

// API to handle login requests from clients
// Expects username & hashed password in request body
router.post("/", function (req, res) {

  // API looks up on database for the user
  var user = libs.findUser(req.body.email);

  // If the user is found for the email
  if (user) {

    // And password matched
    if ( user.password == req.body.password) {

      // Check if "isActive" is false
      if (!user.isActive) {
        // Set "isActive" true in accounts
        // Remove password reset token in activations
        libs.activateUser(user.email, function (error) {
          res.status(500).json({
            error: error,
            message: "DB operation failed"
          });
        });
      }

      // Strip off password data from user-info
      delete user.password;

      // Send success with user-datails
      res.status(200).json(user);
    } else {

      // So, the password didn't match
      res.status(401).json({
        error: 401,
        message: "Password didn't match."
      });
    }
  } else {

    // Alright, the user wasn't found
    res.status(404).json({
      error: 404,
      message: "Couldn't find the user."
    });
  }
});

module.exports = router;
