const Bookmark = require("./bookmark");
const Draft = require("./draft");
const Photo = require("./photo");
const Story = require("./story");
const User = require("./user");

module.exports = {
  ...Bookmark,
  ...Draft,
  ...Photo,
  ...Story,
  ...User,
};
