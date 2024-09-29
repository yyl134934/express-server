const { Router } = require("express");
const { validationResult, query, checkSchema } = require("express-validator");
const { createJSON } = require("./utils");

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
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const { msg } = errors.array()[0];
      return res.status(400).json(createJSON({}, 400, msg));
    }
    const { id } = req.query;
    const parseId = parseInt(id);

    res.json(createJSON(mockData.find((item) => item.id === parseId)));
  }
);

router.post(
  "/api/users",
  checkSchema({
    name: {
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
      errorMessage: "邮箱格式不正确",
      custom: {
        options: (value) => {
          const isExists = mockData.find((item) => item.email === value);
          if (isExists) {
            throw new Error("邮箱已存在");
          }
          return true;
        },
      },
    },
  }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const { msg } = errors.array()[0];
      return res.status(400).json(createJSON({}, 400, msg));
    }

    const { name, email } = req.body;
    res.json(createJSON({ name, email }));
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
