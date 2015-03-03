/**
 * Core API handler
 */

var router = require("express").Router();

router.get("/", function (req, res) {
    res.status(406).json({ "message": "Hello, multiverse!" });
});

router.use("/requestinvite", require("./requestinvite"));

module.exports = router;
