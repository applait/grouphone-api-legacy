/**
 * API to handle user logins
 */

var router = require("express").Router();

router.post("/", function (req, res) {
  /*
    1. API server receives a request from Client
    2. API expects username & hashed password
    3. API looks up on database for the user
      i. If the user is found for the email
        a. And password matched
          - Check if "isActive" is false
            # Set "isActive" true in accounts
            # Remove password reset token
          - Send success with user-datails
        b. And password didn't match, send error
      ii. If the user isn't found, send error
  */
  res.status(200).json({});
});

module.exports = router;
