const registerValidation = {
  username: {
    notEmpty: true,
    errorMessage: "username is required",
  },
  email: {
    isEmail: true,
    errorMessage: "invalid email",
  },
  password: {
    isLength: { options: { min: 8 } },
    errorMessage: "password must be at least 8 characters",
  },
};

const loginValidation = {
  email: {
    isEmail: true,
    errorMessage: "invalid email",
  },
  password: {
    isLength: { options: { min: 8 } },
    errorMessage: "password must be at least 8 characters",
  },
};

module.exports = { registerValidation, loginValidation };
