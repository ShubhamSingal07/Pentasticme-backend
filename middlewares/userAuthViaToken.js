const { verifyJWT } = require("../utils/jwt");

const userAuthViaToken = (req, res, next) => {
  const auth = req.header("Authorization");
  const token = auth.split(" ")[1];
  const decodedUser = verifyJWT(token);
  if (!decodedUser) {
    req.user = false;
  }
  req.user = decodedUser;
  return next();
};

module.exports = {
  userAuthViaToken,
};
