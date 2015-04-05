/**
 * API to send signup invitations to users
 */

var router = require("express").Router();

router.post("/", function (req, res) {
  res.status(200).send( "No can do!" );
});

module.exports = router;
