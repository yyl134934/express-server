const { OK } = require("./constants");
const createJSON = (payload = {}, code = OK, msg = "success!") => {
  return {
    ret_code: code,
    ret_msg: msg,
    data: payload,
  };
};

module.exports = { createJSON };
