const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.url}  ${res.statusCode}`);
  next();
};

module.exports = { loggingMiddleware };
