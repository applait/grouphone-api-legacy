/**
 * Shared methods for API calls to reuse
 */

var libs = {
  findUser: function (email) {
    db.accounts.findOne({ email: email }, function (err, doc) {
      if (err) return err;

      if (doc && doc.email) {
          return doc;
      } else return null;
    });
  },

  activateUser: function (email, callback) {
    db.accounts.update(
      { email: email },
      {
        $set: { isActive: true },
        $currentDate: { lastModified: true }
      },
      function (err) {
        if (err) return callback(err);
        db.activations.remove( { email: email }, function (error) {
          // @TODO: maybe rollback isActive?
          if (error) return callback(error);
        });
      }
    );
  },

  verifySession: function (params) {
    db.sessions.findOne({ email: params.email }, function (err, doc) {
      if (doc && doc.sessions && doc.sessions[params.sessionId]) return true;
      else return false;
    });
  }
}

module.exports = libs;
