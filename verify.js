/**
 * API to verify user's logged in sessions
 */

var router = require("express").Router();

router.get("/:email/:sessionId", function (req, res) {

  // API looks up on database for the user's active sessions
  libs.verifySession(req.params, function (result) {
    if (result) {
      res.status(200).json( { session: result.sessions[req.params.sessionId] } );
    } else res.status(200).json( { session: null } );
  });

});

module.exports = router;
