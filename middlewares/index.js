const userAuth = require("./userAuthViaToken");
const adminAuth = require("./adminAuth");
const readerAuth = require("./readerAuth");

module.exports = {
  ...adminAuth,
  ...userAuth,
  ...readerAuth,
};
