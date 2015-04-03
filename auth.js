/**
 * Authentication API handler
 */

var router = require("express").Router();

// For a get request, send the sign-in page
router.get("/login", function (req, res) {
    res.status(200).sendFile("static/login.html", {
        root: __dirname + "/../"
    });
});

// For a post request, process the given payload
// user information with the passport strategy
router.post("/login", function (req, res) {
    res.status(200).redirect("/app");
});

// Handle user activation on invite URL access
router.get("/activate", function (req, res) { res.redirect(302, "login") });

router.get("/activate/:code", function (req, res) {
    db.activations.findOne({ code: req.params.code }, function (err, doc) {
        if (doc && doc.email) {
            res.status(200).json(doc);
        } else res.status(400).json(err);
    });
});

router.post("/activate", function (req, res) {
    db.activations.findOne({ email: req.body.email }, function (err, doc) {
        if (doc && doc.code === req.body.code) {
            db.accounts.update(
                { email: req.body.email },
                {
                    $set: {
                        // Password hash needs to be salted
                        password: req.body.password,
                        isActive: true
                    },
                    $currentDate: { lastModified: true }
                },
                function (error, document) {
                    if (error) res.status(500).json(error);
                    res.status(200).json(document);
                }
            );
        } else res.status(400).json(err);
    });
});

module.exports = router;
