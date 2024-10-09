const { Router } = require("express");
const {
  registerValidation,
  loginValidation,
} = require("../validations/auth.validation");
const {
  register,
  login,
  logout,
  profile,
} = require("../controllers/auth.controller");
const { validMiddleware } = require("../middlewares/common.middleware");
const { authenticateJWT } = require("../middlewares/auth.middleware");

const router = Router();

router.post("/api/register", validMiddleware(registerValidation), register);
router.post("/api/login", validMiddleware(loginValidation), login);
router.post("/api/logout", authenticateJWT, logout);
router.post("/api/profile", profile);

module.exports = router;
