const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const gravatar = require("gravatar");
const randomstring = require("randomstring");
const mailer = require("../../misc/mailer");
const UserController = require("../../controller/user");

// Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

router.get("/test", (req, res) =>
  res.json({ msg: "test api is working of users" })
);

router.post("/dan", (req, res) => res.json({ kut: "jhal" }));

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ "local.email": req.body.email }).then((user) => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm", // Default
      });
      const Token = randomstring.generate();
      const newusers = new User({
        method: "local",
        local: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          avatar,
          secretToken: Token,
          // flag  account as inactive
          active: false,
        },
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newusers.local.password, salt, (err, hash) => {
          if (err) throw err;
          newusers.local.password = hash;
          newusers
            .save()
            .then((user) => {
              res.json("verify your email");
              let mailOption = {
                from: "raufhassan41@gmail.com",
                to: user.local.email,
                subject: "Testing",
                html: `Hi there,
                <br/>
                Thank you for registering!
                <br/><br/>
                Please verify your email by typing the following token:
                <br/>
                Token: <b>${Token}</b>
                <br/>
                On the following page:
                <a href="http://localhost:3000/users/verify">http://localhost:3000/users/verify</a>
                <br/><br/>
                Have a pleasant day.`,
              };

              mailer(mailOption);
              console.log(user.email);
              console.log("successfully sent");
            })
            .catch((err) => console.log(err));
          // .then(user => res.json(user))

          // Compose email

          // Send email
          /* mailer.sendEmail(
                "admin@munshi.com",
                req.body.email,
                "Please verify your email!",
                html
              ); */

          //end
        });
      });
    }
  });
});

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ "local.email": req.body.email }).then((user) => {
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }
    if (!user.local.active) {
      return res.status(400).json({ message: "verify your email" });
    } else
      bcrypt.compare(req.body.password, user.local.password).then((isMatch) => {
        if (isMatch) {
          // user matched
          const payload = {
            id: user.id,
            name: user.local.name,
            avatar: user.local.avatar,
          };
          //sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
              });
            }
          );
          // res.json({ msg: "successfully logged in " });
        } else {
          errors.password = "Password incorrect";
          return res.status(400).json(errors);
        }
      });
  });
});

router.post("/userdata", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      res.json(user);
    } else {
      res.json({ message: "cannot find user" });
    }
  });
});
// verification of email api
router.post("/verify", (req, res) => {
  User.findOne({ "local.secretToken": req.body.secretToken }).then((user) => {
    console.log(req.body.secretToken);
    if (user) {
      //return res.status(404);
      user.local.active = true;
      user.save();
      res.json({ message: "email verified" });
    } else {
      res.json({ message: "cannot verify" });
    }
  });
});
// forget password api
router.post("/forgot", (req, res) => {
  User.findOne({ "local.email": req.body.email }).then((user) => {
    if (user) {
      res.json(user._id);
      let mailOption = {
        from: "raufhassan41@gmail.com",
        to: user.local.email,
        subject: "Testing",
        html: `Hi there,
        <br/>
        Thank you for registering!
        <br/><br/>
        Please verify your email by typing the following token:
        <br/>
        <br/>
        On the following page:
        <a href="http://localhost:3000/reset/${user._id}">click here to reset password</a>
        <br/><br/>
        Have a pleasant day.`,
      };
      mailer(mailOption);
    } else {
      res.json({ msg: "invalid email" });
    }
  });
});
// password reset
router.post("/reset/:token", (req, res) => {
  console.log(req.params.token);
  console.log(req.body.data);
  User.findById(req.params.token).then((user) => {
    if (user) {
      user.local.password = req.body.data;

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.local.password, salt, (err, hash) => {
          if (err) throw err;
          user.local.password = hash;
          user
            .save()
            .then((user) => {
              res.json(user);
            })
            .catch((err) => console.log(err));
        });
      });

      // user.save();
      // res.json("updated");
    } else {
      res.json({ msg: "no details exist" });
    }
  });
});

// facebook  OAuth
router
  .route("/oauth/facebook")
  .post(
    passport.authenticate("facebookToken", { session: false }),
    UserController.facebookOAuth
  );

// google OAuth
router
  .route("/oauth/google")
  .post(
    passport.authenticate("googleToken", { session: false }),
    UserController.googleOAuth
  );

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);

module.exports = router;
