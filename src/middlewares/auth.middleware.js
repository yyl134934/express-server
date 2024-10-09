const passport = require("passport");
//通用的身份验证中间件
const authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: info ? info.message : "Unauthorized" });
    }
    req.user = user;
    next();
  })(req, res, next);
};
// const authenticateJWT = passport.authenticate("jwt", { session: false });

module.exports = { authenticateJWT };
