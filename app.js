/**
 * Application API handler
 */

var router = require("express").Router();

// For a get request, send the sign-in page
router.get("/", function (req, res) {
    res.status(200).send("static/matrix.html");
});

module.exports = router;
