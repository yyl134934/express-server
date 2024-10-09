const { Router } = require("express");
const { authenticateJWT } = require("../middlewares/auth.middleware");
const {
  getUserValidation,
  updateUserValidation,
  deleteUserValidation,
  resetPasswordValidation,
} = require("../validations/user.validation");
const {
  getUser,
  updateUser,
  resetPassword,
  deleteUser,
} = require("../controllers/user.controller");
const { validMiddleware } = require("../middlewares/common.middleware");

const router = Router();

router.get(
  "/api/users/:id",
  authenticateJWT,
  validMiddleware(getUserValidation),
  getUser
);

router.patch(
  "/api/users/:id",
  authenticateJWT,
  validMiddleware(updateUserValidation),
  updateUser
);

router.delete(
  "/api/users/:id",
  authenticateJWT,
  validMiddleware(deleteUserValidation),
  deleteUser
);

router.patch(
  "/api/users/resetpassword/:id",
  authenticateJWT,
  validMiddleware(resetPasswordValidation),
  resetPassword
);

module.exports = router;
