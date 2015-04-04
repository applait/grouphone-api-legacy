/**
 * Handle client-rasied forgot password requests
 */

var router = require("express").Router();

router.post("/", function (req, res) {
  /*
    1. API server receives a request from Client
    2. API expects username in request body
    3. API looks up on database for the user
      i. If the user is found for the email
        a. Check "isActive" on accounts
          - If true, break;
          - If false
            # Set "isActive" false
            # Generate password reset token
        b. Email user with password reset URL
        c. Respond to client, email sent
  */
  res.status(200).json({});
});

module.exports = router;
