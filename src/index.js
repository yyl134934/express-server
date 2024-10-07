const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const { PORT } = require("./config");
const router = require("./routes");
const { loggingMiddleware } = require("./middleware");
require("./strategies/local-strategy");

const app = express();

mongoose
  .connect("mongodb://localhost/tutorial")
  .then(() => console.log("MongoDB连接成功"))
  .catch((err) => console.error("MongoDB连接失败:", err));

app.use(express.json());
app.use(loggingMiddleware);
app.use(
  session({
    secret: "your secret key", // 用于加密会话数据,需要和cookie-parser一致
    resave: false, // 是否在每次请求时重新保存会话(关闭优化性能)
    saveUninitialized: false, // 是否保存未初始化的会话(关闭优化性能)
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      ttl: 14 * 24 * 60 * 60, // = 14 天。默认
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(router);

app.listen(PORT, () => {
  console.log(`>===============================================<`);
  console.log(` server is running on : http://localhost:${PORT} `);
  console.log(`>===============================================<`);
});
