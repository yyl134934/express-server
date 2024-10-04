const bcrypt = require("bcrypt");

// 生成盐和哈希密码
async function hashPassword(plainTextPassword) {
  const saltRounds = 10; // 盐的复杂度
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(plainTextPassword, salt);
    return hash;
  } catch (error) {
    console.error("密码哈希失败:", error);
  }
}

// 验证密码
async function verifyPassword(plainTextPassword, hashedPassword) {
  try {
    const match = await bcrypt.compare(plainTextPassword, hashedPassword);
    return match; // 如果密码匹配，返回 true；否则返回 false
  } catch (error) {
    console.error("密码验证失败:", error);
    return false;
  }
}

module.exports = { hashPassword, verifyPassword };
