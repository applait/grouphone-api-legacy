/**
 * Handle user activation on joining service
 */

var router = require("express").Router();

router.get("/:code", function (req, res) {
  /*
    1. API server receives a request from Client
    2. API expects reset token in request params
    3. API looks up on database for the token
      i. If the user is found for the token
        a. Send success response
        b. Include email and token
      ii. If the user isn't found, send error
  */
  res.status(200).json({});
});

router.post("/activate", function (req, res) {
  /*
    1. API server receives a request from Client
    2. API expects email, password & token in request body
    3. API looks up on activations for the user with email
      i. If the user is found & token matches
        a. Look up on accounts for user with Email
        b. Update password-hash
        b. Send welcome email
        c. Send success
      ii. If the user is found, but token doesn't match
        a. Send error, no pending password reset request
      iii. If the user isn't found, send error
  */
});

module.exports = router;
