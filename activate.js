/**
 * Handle user activation on joining service
 */

var router = require("express").Router();

// API to handle password change requests
// Expects activation token as URL parameters
router.get("/:token", function (req, res) {

  // API looks up on activations for existing request
  libs.validateToken(req.params.token, function (err, result) {

    if (err) {
      // Send back error if the record wasn't found
      return res.status(500).json({
        error: error,
        message: "Coulnd't find user on the guest list."
      });
    }

    // Send back email along with the token
    return res.status(200).json(result);
  });
});

router.post("/", function (req, res) {

  // API looks up on activations for existing request
  libs.validateToken(req.body.token, function (err, doc) {

    if (err) {
      // Send back error if the record wasn't found
      return res.status(500).json({
        error: err,
        message: "No pending activation request for the user."
      });
    }

    // Update password on accounts collection
    libs.updatePassword(req.body, function (err) {

      if (err) {
        // Return error if update password fails
        return res.status(500).json({
          error: err,
          message: "DB operation failed"
        });
      }

      // @TODO: Update sendEmail params
      libs.sendEmail({}, function (err, result) {});
      return res.status(200).json({ success: true });
    });
  });
});

module.exports = router;
