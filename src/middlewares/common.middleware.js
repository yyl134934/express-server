const { checkSchema } = require("express-validator");
const { validationResult } = require("express-validator");
const { createJSON } = require("../routes/utils");
const _isValid = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];
    return res.status(400).json(createJSON({}, 400, msg));
  }
  next();
};
const validMiddleware = (schema) => [checkSchema(schema), _isValid];

const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.url}  ${res.statusCode}`);
  next();
};

module.exports = { validMiddleware, loggingMiddleware };
