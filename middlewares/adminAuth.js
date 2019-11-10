const { verifyJWT } = require("../utils/jwt");

const adminAuth = async (req, res, next) => {
  const auth = req.header("Authorization");
  if (!auth) {
    return res.status(403).send({
      error: "Only for logged in Users",
    });
  }
  const token = auth.split(" ")[1];
  if (token === "undefined" || !token) {
    return res.status(403).send({
      error: "Only for logged in Users",
    });
  }
  const decodedUser = verifyJWT(token);
  if (!decodedUser) {
    return res.status(403).send({
      error: "You should log in first",
    });
  }
  if (decodedUser.role !== "Admin") {
    return res.status(403).send({
      error: "Only for admin",
      user: decodedUser,
    });
  }
  req.user = decodedUser;
  return next();
};

module.exports = {
  adminAuth,
};
