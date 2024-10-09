const mongoose = require("mongoose");
const moment = require("moment");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    default: "",
  },
  created: {
    type: Number,
    default: 0,
  },
  updated: {
    type: Number,
    default: 0,
  },
  role: {
    type: Number,
    default: 1,
  },
});

UserSchema.pre("validate", function (next) {
  this.created = this.created || moment().format("X");
  this.updated = moment().format("X");
  next();
});
const User = mongoose.model("User", UserSchema);

module.exports = User;
