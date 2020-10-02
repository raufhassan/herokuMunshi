const dotnenv = require("dotenv").config();
module.exports = {
  oauth: {
    google: {
      clientID: process.env.oauthID,
      clientSecret: process.env.oauthSecret,
    },
    facebook: {
      clientID: process.env.fbID,
      clientSecret: process.env.fbSecret,
    },
  },
};
