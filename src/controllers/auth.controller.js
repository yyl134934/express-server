const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user.model");
const { createJSON } = require("../routes/utils");
const { hashPassword, verifyPassword } = require("../utils/helper");
const { JwtOptions } = require("../common/config");

const register = async (req, res) => {
  const { username, email, password } = req.body;

  // 检测用户是否已存在
  try {
    const user = await User.findOne({ username });
    if (user) {
      return res
        .status(409)
        .json(createJSON(null, 409, "The user already exists."));
    }
  } catch (error) {
    return res.status(500).json(createJSON(null, 500, error.message));
  }

  // 写入用户数据
  let hashPwd;
  try {
    hashPwd = await hashPassword(password);
  } catch (error) {
    return res.status(500).json(createJSON(null, 500, error.message));
  }
  try {
    const newUser = await User.create({
      username,
      email,
      password: hashPwd,
    });
    res.status(201).json(
      createJSON(
        {
          username: newUser?.username,
          email: newUser?.email,
          role: newUser?.role,
          id: newUser?._id,
        },
        201
      )
    );
  } catch (error) {
    res.status(500).json(createJSON(null, 500, error.message));
  }
};

const generateToken = (user) => {
  const jti = uuidv4(); // 生成唯一的 jti
  const payload = {
    id: user.id,
    jti: jti,
    version: user.tokenVersion,
  };

  return jwt.sign(payload, JwtOptions.secretOrKey, {
    expiresIn: JwtOptions.expireTime,
  });
};
const login = async (req, res) => {
  // 检测登录信息
  const { email, password } = req.body;

  let user;
  try {
    user = await User.findOne({ email });
  } catch (error) {
    res.json(createJSON(null, 500, error.message));
  }

  if (!user || !(await verifyPassword(password, user.password))) {
    return res
      .status(401)
      .json(createJSON(null, 401, "Invalid username or password"));
  }

  // 生成访问token
  const token = generateToken(user);

  // 更新db用户token
  try {
    await User.updateOne({ _id: user.id }, { $set: { token } });
  } catch (error) {
    res.status(500).json(createJSON(null, 500, error.message));
  }

  res.json(createJSON({ token, expiresIn: JwtOptions.expireTime }));
};

const logout = async (req, res) => {};
const profile = async () => {};

module.exports = { register, login, logout, profile };
