const passport = require("passport");
const { Strategy } = require("passport-local");
const User = require("../models/user");
const { verifyPassword } = require("../utils/helper");

passport.serializeUser(function (user, done) {
  console.log("🚀🐍 ~ user:", user);
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  console.log("🚀🐍 ~ id:", id);
  try {
    const findUser = await User.findById(id);
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const findUser = await User.findOne({ username });
      if (!findUser) throw new Error("User not found");

      const match = await verifyPassword(password, findUser.password);

      if (!match) throw new Error("Bad Credentials");
      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);
