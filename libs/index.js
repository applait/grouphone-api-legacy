/**
 * Shared methods for API calls to reuse
 */

var libs = {
  findUser: function (email, callback) {
    db.accounts.findOne({ email: email }, function (err, doc) {
      if (err) return err;
      else callback(doc);
    });
  },

  activateUser: function (email, callback) {
    db.accounts.update(
      { email: email },
      { $set: { isActive: true } },
      function (err) {
        if (err) callback(err);

        else db.activations.remove({ email: email }, function (error) {
          // @TODO: maybe rollback isActive?
          if (error) callback(error);
        });
      }
    );
  },

  deactivateUser: function (email, done, fail) {
    db.accounts.update(
      { email: email },
      { $set: { isActive: false } },
      function (err) {
        if (err) fail(err);

        else db.activations.insert({
          email: email,
          token: libs.generateToken(email)
        }, function (error, doc) {
          if (error) fail(error);
          else done(doc);
        });
      }
    );
  },

  updatePassword: function (params, done, fail) {
    db.accounts.update(
      { email: params.email },
      { $set: { password: params.password } },
      function (err) {
        if (err) fail(err);

        else db.activations.remove({ email: email }, function (error) {
          if (error) fail(error);
          else done();
        });
      }
    );
  },

  validateToken: function (token, done, fail) {
    db.activations.findOne({ token: token }, function (err, doc) {
      if (doc && doc.email) done(doc);
      else fail(err);
    });
  },

  verifySession: function (params, callback) {
    db.sessions.findOne({ email: params.email }, function (err, doc) {
      if (doc && doc.sessions && doc.sessions[params.sessionId]) callback(doc);
      else callback(false);
    });
  },

  generateToken: function (email) {
    var token = email + Date.now() + config.SALT;
    return require("crypto").createHash("sha1").update(token).digest("hex");
  },

  sendEmail: function (params) {
    // Handle emailing with http://www.nodemailer.com/
    console.log("Email Sent!");
  }
}

module.exports = libs;
