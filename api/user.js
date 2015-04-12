/**
 * Handle user related endpoints
 */

var router = require("express").Router();

/**
 * Create a new user account
 */
router.post("/create", function (req, res) {
  var email = req.body && req.body.email && req.body.email.trim();
  var name = req.body && req.body.name && req.body.name.trim();
  var sendEmail = req.sendEmail || false;
  var isInvite = req.isInvite || false;

  if (!email) {
    return res.status(401).json({ message: "Need email to be passed as a body parameter." });
  }

  libs.addUser({ email: email, name: name }, function (err, user) {
    if (err) {
      return res.status(err.status).json({ message: err.message });
    }
    if (sendEmail) {
      var tmpl = isInvite ? "email/signupinvite" : "email/signupnormal";
      res.render(tmpl, user, function (err, html) {
        if (err) return console.log(err);
        libs.sendEmail({ html: html, subject: "Welcome to Grouphone!", email: user.email });
      });
    }
    res.status(200).json(user);
  });
});

/**
 * Fetch user account information using email
 */
router.get("/:email", function (req, res) {
  libs.findUser(req.params.email, function (err, user) {
    if (err) return res.status(500).json({ message: "Unable to fetch user details." });
    if (user === null) return res.status(401).json({ message: "User not found." });
    user.password && (delete user.password);
    user._id && (delete user._id);
    res.status(200).json(user);
  });
});

module.exports = router;
