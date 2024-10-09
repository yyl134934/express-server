const getUserValidation = {
  id: {
    isMongoId: true,
    errorMessage: "invalid id",
  },
};
const deleteUserValidation = {
  id: {
    isMongoId: true,
    errorMessage: "invalid id",
  },
};
const updateUserValidation = {
  email: {
    isEmail: true,
    errorMessage: "invalid email",
  },
  username: {
    isLength: {
      options: { min: 3 },
      errorMessage: "username must be at least 3 chars long",
    },
  },
  role: {
    isIn: {
      options: [["0", "1", "2", "3"]],
      errorMessage: "invalid role",
    },
  },
};

const resetPasswordValidation = {
  password: {
    isLength: {
      options: { min: 6 },
      errorMessage: "password must be at least 6 chars long",
    },
  },
  new_password: {
    isLength: {
      options: { min: 6 },
      errorMessage: "password must be at least 6 chars long",
    },
  },
};

module.exports = {
  getUserValidation,
  deleteUserValidation,
  updateUserValidation,
  resetPasswordValidation,
};
