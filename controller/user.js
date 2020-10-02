const JWT = require("jsonwebtoken");
const User = require("../models/User");
const key = require("../config/keys").secretOrKey;

signToken = (user) => {
  return JWT.sign(
    {
      iss: "munshi",
      sub: user.id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1), // current time + 1 day ahead
    },
    key
  );
};
module.exports = {
  /* googleOAuth: async (req, res, next) => {
    // Generate token
    console.log("got here");
    const token = "Bearer " + signToken(req.user);
    res.status(200).json({ token });
  }, */
  facebookOAuth: async (req, res, next) => {
    console.log("got here");
    const token = "Bearer " + signToken(req.user);
    res.status(200).json({ token });
  },
  googleOAuth: async (req, res, next) => {
    // Generate token
    console.log("got here");
    const token = "Bearer " + signToken(req.user);
    res.status(200).json({ token });
  },
};
