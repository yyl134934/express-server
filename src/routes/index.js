const { Router } = require("express");
const usersRoutes = require("./users.routes");
const authRoutes = require("./auth.routes");

const router = Router();

router.use(authRoutes);
router.use(usersRoutes);

module.exports = router;
