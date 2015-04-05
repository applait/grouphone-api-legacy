/**
 * Shared methods for API calls to reuse
 */

var libs = {
  findUser: function (email, callback) {
    db.accounts.findOne({ email: email }, { _id: 0 }, function (err, doc) {
      if (err) return callback(err);
      else callback(null, doc);
    });
  },

  activateUser: function (email, callback) {
    db.activations.remove({ email: email }, function (error) {
      if (error) return callback(error);
      db.accounts.update({ email: email }, { $set: { isActive: true }}, function (error) {
        if (error) return callback(error);
        callback(null);
      });
    });
  },

  deactivateUser: function (email, callback) {
    var token = libs.generateToken(email);
    db.activations.remove({ email: email }, function (error) {
      if (error) return callback(error);
      db.activations.insert({ email: email, token: token }, function (error) {
        if (error) return callback(error);
        db.accounts.update({ email: email }, { $set: { isActive: false }}, function (error) {
          if (error) return callback(error);
          callback(null, token);
        });
      });
    });
  },

  updatePassword: function (params, callback) {
    db.accounts.update(
      { email: params.email },
      { $set: { password: params.password } },
      function (err) {
        if (err) return callback(err);

        db.activations.remove({ email: params.email }, function (error) {
          if (error) return callback(error);
          callback(null);
        });
      }
    );
  },

  validateToken: function (token, callback) {
    db.activations.findOne({ token: token }, function (err, doc) {
      if (err) return callback(err);
      callback(null, doc);
    });
  },

  verifySession: function (params, callback) {
    db.sessions.findOne({ email: params.email }, function (err, doc) {
      if (err) return callback(err);
      if (doc && doc.sessions && doc.sessions[params.sessionId]) callback(null, doc);
      else callback(null, false);
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
   * @param {Function} callback - The callback gets two args. The first arg is set only when there is an error. The
   * second arg contains the result object.
   */
  sendEmail: function (params, callback) {
    var mandrill = (new require("mandrill-api/mandrill")).Mandrill(config.MANDRILL_API_KEY);

    var message = {
      "html": params.body, // @TODO: Parse this through an ejs template made for email
      "subject": params.subject,
      "from_email": config.SITE_EMAIL ? config.SITE_EMAIL : "noreply@grouphone.me",
      "from_name": config.SITE_NAME ? config.SITE_NAME : "Grouphone",
      "to": params.to
    };

    mandrill.messages.send({ message: message, async: true }, function (result) {
      callback(null, result);
    }, function (e) {
      console.log("Error sending email: " + e.name + ": " + e.message);
      callback("Error sending email: " + e.name + ": " + e.message);
    });
  }

};

module.exports = libs;
