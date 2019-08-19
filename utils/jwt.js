const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const createJWT = user => jwt.sign({ data: user }, JWT_SECRET, { expiresIn: 60 * 60 });

const verifyJWT = token => jwt.decode(token, JWT_SECRET);

module.exports = {
  createJWT,
  verifyJWT,
};
