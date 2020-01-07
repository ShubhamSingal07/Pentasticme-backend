const { verifyJWT } = require("../utils/jwt");

const userAuthViaToken = (req, res, next) => {
  const auth = req.header("Authorization");
  if (!auth) {
    req.user = false;
    return next();
  }
  const token = auth.split(" ")[1];
  if (token === "undefined" || !token) {
    req.user = false;
    return next();
  }
  const decodedUser = verifyJWT(token);
  if (!decodedUser) {
    req.user = false;
  } else {
    req.user = decodedUser;
  }
  return next();
};

module.exports = {
  userAuthViaToken
};
