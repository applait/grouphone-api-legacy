/**
 * API to handle user logins
 */

var router = require("express").Router();

// API to handle login requests from clients
// Expects username & hashed password in request body
router.post("/", function (req, res) {

  // API looks up on database for the user
  libs.findUser(req.body.email, function (err, user) {

    if (err) {
      return res.status(500).json({
        error: err,
        message: "DB operation failed"
      });
    }

    // If the user is found for the email
    if (user) {

      // And password matched
      if ( user.password == libs.hashPassword(req.body.password)) {

        // Check if "isActive" is false
        if (!user.isActive) {
          // Set "isActive" true in accounts
          // Remove password reset token in activations
          libs.activateUser(user.email, function (error) {
            if (error) {
              // Dear future self, if you are laughing at this, you better help fix it.
              console.log("Error activating user", error);
            }
          });
        }

        // Strip off password data from user-info
        delete user.password;

        // Generate user token and set session info
        libs.addSession(user.email, function (error, token) {
          if (error) {
            return res.status(500).json({
              error: error,
              message: "DB operation failed"
            });
          }
          user.token = token;
          // Send success with user-datails
          return res.status(200).json(user);
        });

      } else {

        // So, the password didn't match
        return res.status(401).json({
          error: 401,
          message: "Password didn't match."
        });
      }
    } else {

      // Alright, the user wasn't found
      return res.status(404).json({
        error: 404,
        message: "Couldn't find the user."
      });
    }
  });
});

module.exports = router;
