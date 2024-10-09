const { ExtractJwt } = require("passport-jwt");
module.exports = {
  MONGO_URI: "mongodb://localhost/tutorial",
  PORT: 4040,
  JwtOptions: {
    // issuer: "http://localhost:4040",
    // audience: "http://localhost:4040",
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "secretKey",
    expireTime: "24h",
  },
};
