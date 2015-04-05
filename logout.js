var router = require("express").Router();

// API to handle logout requests from clients
// Expects email & token in request query
router.get("/", function (req, res) {
  var email = req.query && req.query.email,
      token = req.query && req.query.token;

  libs.removeSession(email, token, function (err, result) {
    if (err) {
      return res.status(500).json({
        error: err,
        message: "DB operation failed"
      });
    }
    res.status(200).json(result);
  });
});

module.exports = router;
