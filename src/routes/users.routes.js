const { Router } = require("express");
const { validationResult, query, checkSchema } = require("express-validator");
const { createJSON } = require("./utils");
const User = require("../models/user");
const { hashPassword } = require("../utils/helper");

const router = Router();

const mockData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@gmail.com",
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane@gmail.com",
  },
  {
    id: 3,
    name: "Jim Doe",
    email: "jim@gmail.com",
  },
];

router.get(
  "/api/users",
  query("id")
    .isString()
    .notEmpty()
    .withMessage("id 不能为空")
    .isLength({ min: 1, max: 32 })
    .withMessage("id 长度必须为 1-32位"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const { msg } = errors.array()[0];
      return res.status(400).json(createJSON({}, 400, msg));
    }
    const { id } = req.query;

    try {
      const result = await User.findById(id);
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

router.delete("/api/users", (req, res) => {
  const { id } = req.query;
  const parseId = parseInt(id);
  const user = mockData.find((item) => item.id === parseId);

  res.send(createJSON(user));
});

router.patch("/api/users", (req, res) => {
  const { id } = req.query;
  const parseId = parseInt(id);
  const { name, email } = req.body;

  const user = mockData.find((item) => item.id === parseId);
  res.json(createJSON({ ...user, name, email }));
});

router.put("/api/users", (req, res) => {
  const { id } = req.query;
  const parseId = parseInt(id);
  const { name, email } = req.body;

  const user = mockData.find((item) => item.id === parseId);
  res.json(createJSON({ ...user, name, email }));
});

module.exports = router;
