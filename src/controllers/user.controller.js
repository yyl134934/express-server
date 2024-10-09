const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { createJSON } = require("../routes/utils");
const { hashPassword, verifyPassword } = require("../utils/helper");

const getUser = async (req, res) => {
  const { id } = req.params;

  // 检测用户是否存在
  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(401)
        .json(createJSON(null, 401, "User does not exist."));
    }
    return res.status(200).json(
      createJSON(
        {
          username: user?.username,
          email: user?.email,
          role: user?.role,
          id: user?._id,
        },
        200
      )
    );
  } catch (error) {
    return res.status(500).json(createJSON(null, 500, error.message));
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const user = req.body;
  try {
    const { matchedCount } = await User.updateOne(
      { _id: id },
      { $set: { ...user } }
    );
    if (matchedCount > 0) {
      return res.status(200).json(createJSON({}));
    }

    res.status(404).json(createJSON({}, 404, "failed to update user"));
  } catch (error) {
    res.status(500).json(createJSON(null, 500, error.message));
  }
};

const resetPassword = async (req, res) => {
  const { id } = req.params;
  const { password, new_password } = req.body;

  // 检测用户是否存在
  try {
    const user = await User.findById(id);
    if (!user || !(await verifyPassword(password, user.password))) {
      return res
        .status(401)
        .json(createJSON(null, 401, "Invalid old password"));
    }
  } catch (error) {
    return res.status(500).json(createJSON(null, 500, error.message));
  }

  // 更新密码
  try {
    const hashPwd = await hashPassword(new_password);
    const { matchedCount } = await User.updateOne(
      { _id: id },
      { $set: { password: hashPwd } }
    );
    if (matchedCount > 0) {
      return res.status(200).json(createJSON({}));
    }

    res.status(404).json(createJSON({}, 404, "failed to update user"));
  } catch (error) {
    res.status(500).json(createJSON(null, 500, error.message));
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const { deletedCount } = await User.deleteOne({ _id: id });
    if (deletedCount > 0) {
      return res.status(200).json(createJSON({}));
    }

    res.status(404).json(createJSON({}, 404, "failed to delete user"));
  } catch (error) {
    res.status(500).json(createJSON(null, 500, error.message));
  }
};

module.exports = { getUser, updateUser, resetPassword, deleteUser };
