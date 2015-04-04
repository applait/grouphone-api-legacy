/**
 * API to verify user's logged in sessions
 */

var router = require("express").Router();

router.get("/:email/:sessionId", function (req, res) {

  // API looks up on database for the user's active sessions
  var sessionIsActive = libs.verifySession(req.params);

  if (sessionIsActive) {
    res.status(200).json( { sessionId: req.body.sessionId } );
  } else res.status(200).json( { sessionId: null } );

});

module.exports = router;
