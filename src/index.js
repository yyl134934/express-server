const express = require("express");
const { PORT } = require("./config");
const router = require("./routes");

const app = express();

app.use(express.json());
const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.url}  ${res.statusCode}`);
  next();
};
app.use(loggingMiddleware);

app.use(router);

app.listen(PORT, () => {
  console.log(`>===============================================<`);
  console.log(` server is running on : http://localhost:${PORT} `);
  console.log(`>===============================================<`);
});
