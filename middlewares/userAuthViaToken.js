const { verifyJWT } = require("../utils/jwt");

const userAuthViaToken = (req, res, next) => {
  const auth = req.header("Authorization");
  if (auth) {
    const token = auth.split(" ")[1];
    const decodedUser = verifyJWT(token);
    if (!decodedUser) {
      req.user = false;
    } else {
      req.user = decodedUser;
    }
  } else {
    req.user = false;
  }
  return next();
};

module.exports = {
  userAuthViaToken,
};
