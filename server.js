const express = require("express");
const db = require("./config/keys").mongoURI;
const mongoose = require("mongoose");
const users = require("./routes/api/users");
const event = require("./routes/api/event");
const bodyparse = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const mailer = require("./misc/mailer");
const app = express();

const nodemailer = require("nodemailer");

app.use(cors());
app.use(bodyparse.urlencoded({ extended: false }));
app.use(bodyparse.json());

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("mongodbconnected"))
  .catch((err) => console.log(err));

app.get("/go/shop", (req, res) =>
  res.send("hello brother welcome to munshi event")
);
app.get("/go", (req, res) => res.send("Go"));

// passport middleware
app.use(passport.initialize());

//passport config
require("./config/passport")(passport);

//use routes
app.use("/api/users/", users);
// app.use("/api/event/", event);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server running on port ${port}`));
