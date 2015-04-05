/**
 * Shared methods for API calls to reuse
 */

var libs = {
  findUser: function (email, callback) {
    db.accounts.findOne({ email: email }, function (err, doc) {
      if (err) return callback(err);
      else callback(null, doc);
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

  addSession: function (email, client, callback) {
    if (client instanceof Function) {
      callback = client;
      client = "Grouphone Web";
    }
    var token = libs.generateToken(email);
    db.sessions.findOne({ email: email }, function (err, doc) {
      if (err) return callback(err);
      if (doc) {
        doc.sessions[token] = { id: token, client: client };
        db.sessions.update({ email: email }, { $set: { sessions: doc.sessions }}, function (err) {
          if (err) return callback(err);
          callback(null, token);
        });
      } else {
        doc = { email: email, sessions: {}};
        doc.sessions[token] = { id: token, client: client };
        db.sessions.insert(doc, function (err) {
          if (err) return callback(err);
          callback(null, token);
        });
      }
    });
  },

  removeSession: function (email, sessionid, callback) {
    db.sessions.findOne({ email: email }, function (err, doc) {
      if (err) return callback(err);
      if (!doc) {
        return callback({ message: "Session not found."});
      }
      if (doc.sessions[sessionid]) delete doc.sessions[sessionid];
      db.sessions.update({ email: email }, { $set: { sessions: doc.sessions }}, function (err) {
        if (err) return callback(err);
        callback(null, { message: "Removed session"});
      });
    });
  },

  generateToken: function (email) {
    var token = email + Date.now() + config.SALT;
    return require("crypto").createHash("sha1").update(token).digest("hex");
  },

  /**
   * Method to send email
   *
   * @param {Object} params - An object containing the email parameters
   * @param {String} params.body - The body content to be sent in the email. This will be rendered into a template.
   * @param {String} params.subject - The subject of the email.
   * @param {Array} params.to - An array of objects per receiver. Each object needs to contain: { email: "", name: ""}.
   * `name` is optional.
   */
  sendEmail: function (params) {
    var mandrill = (new require("mandrill-api/mandrill")).Mandrill(config.MANDRILL_API_KEY);

    var message = {
      "html": params.body, // @TODO: Parse this through an ejs template made for email
      "subject": params.subject,
      "from_email": config.SITE_EMAIL ? config.SITE_EMAIL : "noreply@grouphone.me",
      "from_name": config.SITE_NAME ? config.SITE_NAME : "Grouphone",
      "to": params.to
    };

    mandrill.messages.send({ message: message, async: true }, function (result) {
      console.log("Email sent", result);
    }, function (e) {
      console.log("Error sending email: " + e.name + ": " + e.message);
    });
  }

};

module.exports = libs;
