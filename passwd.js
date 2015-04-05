/**
 * Handle password reset requests
 */

var router = require("express").Router();

// API to handle password change requests
// Expects activation token as URL parameters
router.get("/:token", function (req, res) {

  // API looks up on activations for existing request
  libs.validateToken(req.params.token, function (err, result) {

    if (err || !result) {
      // Send back error if the record wasn't found
      return res.status(500).json({
        error: error,
        message: "No pending password reset request for the user."
      });
    }

    // Send back email along with the token
    return res.status(200).json(result);
  });
});

// API to handle update password requests
// Expects email, password & token in request body
router.post("/", function (req, res) {

  // API looks up on activations for existing request
  libs.validateToken(req.body.token, function (err, result) {

    if (err || !result) {
      // Send back error if the record wasn't found
      return res.status(500).json({
        error: error,
        message: "No pending password reset request for the user."
      });
    }

    // Update password on accounts collection
    libs.updatePassword(req.body, function (err) {

      if (err) {
        // Return error is update password fails
        return res.status(500).json({
          error: error,
          message: "DB operation failed"
        });
      }

      // Send success silently
      return res.status(200).json({ success: true });
    });
  });
});

module.exports = router;
