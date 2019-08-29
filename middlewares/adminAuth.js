const { verifyJWT } = require("../utils/jwt");

const adminAuth = async (req, res, next) => {
  const auth = req.header("Authorization");
  if (!auth) {
    return res.status(403).send({
      error: "You should log in first",
    });
  }

  const token = auth.split(" ")[1];
  const decodedUser = verifyJWT(token);
  if (!decodedUser) {
    return res.status(403).send({
      error: "You should log in first",
    });
  }
  if (decodedUser.role !== 'Admin') {
    return res.status(403).send({
      error: "Only for admin",
    });
  }
  req.user = decodedUser;
  return next();
};

module.exports = {
  adminAuth,
};
