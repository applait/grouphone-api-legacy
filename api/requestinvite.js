/**
 * API request invite module
 *
 * Request invites module
 */

var router = require("express").Router();

router.post("/:email", function (req, res) {

    if (!config.ACCEPT_INVITATION) {
        return res.status(403).json({ "message": "Invitations are closed now." });
    }

    if (req.hostname !== config.HOSTNAME) {
        return res.status(403).json({ "message": "Not you. Yes, YOU. NOT you." });
    }
    // Look for the `name` query parameter
    var email = req.params && req.params.email && req.params.email.trim();

    if (!email) {
        return res.status(406).json({ "message": "Need `email` as a query parameter.", "status": 406 });
    }

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) !== true) {
        return res.status(406).json({ "message": "Need a valid email address.", "status": 406 });
    }

    // Check if email already exists
    db.invites.get(email, function (err) {
        if (err) {
            if (err.notFound) {
                // Prepare data object
                var data = {
                    "timestamp": Date.now(),
                    "ip": req.ip
                };

                // Put id in session db
                db.invites.put(email, data, function (err) {
                    if (err) {
                        console.log("[ERR] Inserting request invite email", email, req.ip);
                        return res.status(500).json({ "message": "Oops! Something went wrong", "status": 500 });
                    }
                    res.status(200).json({ "message": "Got it. You are in queue!", "status": 200});
                });
            } else {
                console.log("[ERR] Checking request invite email", email, req.ip);
                return res.status(500).json({ "message": "Oops! Something went wrong", "status": 500 });
            }
        } else {
            return res.status(200).json({
                "message": "This email is already registered. But, we're overjoyed to see your interest!",
                "status": 200
            });
        }
    });
});

module.exports = router;