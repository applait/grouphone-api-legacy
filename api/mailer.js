/**
 * Send an email to a user by selecting a template and sending a custom data
 */

var router = require("express").Router();

/**
 * Create a new user account
 */
router.post("/", function (req, res) {
  var email = req.body && req.body.email && req.body.email.trim();
  var subject = req.body && req.body.subject && req.body.subject.trim();
  var data = req.body && req.body.data;
  var template = req.body && req.body.template && req.body.template.trim();

  if (!email) {
    return res.status(401).json({ message: "Need `email` to be passed as a body parameter." });
  }

  if (!subject) {
    return res.status(401).json({ message: "Need `subject` to be passed as a body parameter." });
  }

  if (!data) {
    return res.status(401).json({ message: "Need `data` to be passed as a body parameter." });
  }

  if (!template) {
    return res.status(401).json({ message: "Need `template` to be passed as a body parameter." });
  }

  res.render(template, data, function (err, html) {
    if (err) {
      console.error("Template rendering error", err);
      return res.status(401).json({ message: "Error rendering template."});
    }
    libs.sendEmail({ html: html, subject: subject, email: email });
    res.status(200).json({ message: "Email sent. User: " + email + ", Subject: " + subject });
  });
});

module.exports = router;
