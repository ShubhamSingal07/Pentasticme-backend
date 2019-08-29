const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const createJWT = user => jwt.sign({ user }, JWT_SECRET, { expiresIn: 24*60*60 });

const verifyJWT = token => {
  const { user, exp } = jwt.decode(token, JWT_SECRET);
  if (Date.now() >= exp * 1000) return false;
  return user;
};

module.exports = {
  createJWT,
  verifyJWT,
};
