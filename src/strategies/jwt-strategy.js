const passport = require("passport");
const { Strategy } = require("passport-jwt");
const User = require("../models/user.model");
const { JwtOptions } = require("../common/config");

passport.use(
  new Strategy(JwtOptions, async (jwt_payload, done) => {
    const { exp, id, jti } = jwt_payload;
    // 超过存活时间
    if (Date.now() > exp * 1000) {
      return done(null, false, { message: "Token has expired" });
    }

    // 检查对象是否存在于数据库中
    let user;
    try {
      user = await User.findById(id);

      // 检查 token 是否在存储中（如果启用了 token 存储）
      // if (user.token !== jti) {
      //   return done(null, false, { message: "Token has been revoked" });
      // }

      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error, false);
    }
  })
);
