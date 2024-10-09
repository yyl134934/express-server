const createJSON = (payload = {}, code = 200, msg = "success!") => {
  return {
    ret_code: code,
    ret_msg: msg,
    data: payload,
  };
};

module.exports = { createJSON };
