const userAuth = require("./userAuthViaToken");
const adminAuth = require("./adminAuth");
const readerAuth = require("./readerAuth");
const multer = require("./multer");

module.exports = {
  ...adminAuth,
  ...userAuth,
  ...readerAuth,
  ...multer,
};
