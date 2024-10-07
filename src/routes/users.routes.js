const { Router } = require("express");
const { validationResult, query, checkSchema } = require("express-validator");
const passport = require("passport");
const { createJSON } = require("./utils");
const User = require("../models/user");
const { hashPassword } = require("../utils/helper");

const router = Router();

const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json(createJSON({}, 401, "未登录"));
};

router.get(
  "/api/users",
  query("id")
    .isString()
    .notEmpty()
    .withMessage("id 不能为空")
    .isLength({ min: 1, max: 32 })
    .withMessage("id 长度必须为 1-32位"),
  ensureAuth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const { msg } = errors.array()[0];
      return res.status(400).json(createJSON({}, 400, msg));
    }
    const { id } = req.query;

    try {
      const result = await User.findById(id);
      if (!result) {
        return res.status(400).json(createJSON(null, 400, "id不正确"));
      }

      const { password, ...user } = result?._doc;
      res.status(200).json(createJSON(user));
    } catch (error) {
      res.status(500).json(createJSON(null, 500, error.message));
    }
  }
);

router.post(
  "/api/users",
  checkSchema({
    username: {
      in: ["body"],
      isString: true,
      notEmpty: true,
      isLength: {
        options: {
          min: 1,
          max: 32,
        },
      },
    },
    email: {
      in: ["body"],
      isString: true,
      notEmpty: true,
      isEmail: true,
      normalizeEmail: true,
    },
    password: {
      in: ["body"],
      isString: true,
      notEmpty: true,
      isLength: {
        options: {
          min: 6,
          max: 32,
        },
      },
    },
  }),
  ensureAuth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const { msg } = errors.array()[0];
      return res.status(400).json(createJSON({}, 400, msg));
    }

    try {
      const hashPwd = await hashPassword(req.body?.password);
      const newUser = new User({ ...req.body, password: hashPwd });
      await newUser.save();

      const { password, ...user } = newUser._doc;
      res.status(201).json(createJSON(user));
    } catch (error) {
      res.status(400).json(createJSON({}, 400, error.message));
    }
  }
);

router.delete(
  "/api/users",
  query("id")
    .isString()
    .notEmpty()
    .withMessage("id 不能为空")
    .isLength({ min: 1, max: 32 })
    .withMessage("id 长度必须为 1-32位"),
  ensureAuth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const { msg } = errors.array()[0];
      return res.status(400).json(createJSON({}, 400, msg));
    }

    const { id } = req.query;

    try {
      const result = await User.deleteOne({ _id: id });
      res.status(200).json(createJSON(result?._doc));
    } catch (error) {
      res.status(500).json(createJSON(null, 500, error.message));
    }
  }
);

router.patch(
  "/api/users",
  query("id")
    .isString()
    .notEmpty()
    .withMessage("id 不能为空")
    .isLength({ min: 1, max: 32 })
    .withMessage("id 长度必须为 1-32位"),
  ensureAuth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const { msg } = errors.array()[0];
      return res.status(400).json(createJSON({}, 400, msg));
    }

    const { id } = req.query;
    const { username, email } = req.body;

    try {
      const { matchedCount } = await User.updateOne(
        { _id: id },
        { $set: { username, email } }
      );
      if (matchedCount > 0) {
        return res.status(200).json(createJSON({}));
      }

      res.status(404).json(createJSON({}, 404, "id不正确"));
    } catch (error) {
      res.status(500).json(createJSON(null, 500, error.message));
    }
  }
);

module.exports = router;
