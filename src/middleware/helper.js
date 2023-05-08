const { verify } = require("jsonwebtoken");

const checkUserToken = (req, res, next) => {
  let token = req.get("authorization");

  if (token) {
    token = token.slice(7);
    verify(token, process.env.SECRET , (err, decode) => {
      if (err) {
        return res.json({
          st: 0,
          msg: "invalid Token",
        });
      } else {
        req.decode = decode;
        next();
      }
    });
  } else {
    return res.json({
      st: 0,
      msg: "Access Denied! Unauthorized User",
    });
  }
};

const helper = {
  checkUserToken,
};

module.exports = helper;
