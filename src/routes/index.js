const { Router } = require("express");
const usersRoutes = require("./users.routes");

const router = Router();

router.use(usersRoutes);

module.exports = router;
