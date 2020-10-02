const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  /*  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cellnumber: {
    type: Number,
    required: false
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  secretToken: {
    type: String
  },
  active: {
    type: Boolean
  },
  pwdResetToken: {
    type: String
  } */
  method: {
    type: String,
    enum: ["local", "facebook", "google"],
    required: true,
  },
  local: {
    name: {
      type: String,
      //required: true
    },
    email: {
      type: String,
      // required: true
    },
    password: {
      type: String,
      // required: true
    },

    secretToken: {
      type: String,
    },
    active: {
      type: Boolean,
    },
  },
  google: {
    id: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
    },
  },
  facebook: {
    id: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
    },
  },
});
module.exports = User = mongoose.model("DUser", UserSchema);
