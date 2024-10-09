const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const { PORT, MONGO_URI } = require("./common/config");
const router = require("./routes");
const { loggingMiddleware } = require("./middlewares/common.middleware");
require("./strategies/jwt-strategy");

const app = express();

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB连接成功"))
  .catch((err) => console.error("MongoDB连接失败:", err));

app.use(express.json());
app.use(loggingMiddleware);

app.use(passport.initialize());

app.use(router);

app.listen(PORT, () => {
  console.log(`>===============================================<`);
  console.log(` server is running on : http://localhost:${PORT} `);
  console.log(`>===============================================<`);
});
