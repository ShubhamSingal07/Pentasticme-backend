const Bookmark = require("./bookmark");
const Draft = require("./draft");
const Photo = require("./photo");
const Story = require("./story");
const User = require("./user");
const AboutAndContact = require("./aboutAndContact");

module.exports = {
  ...Bookmark,
  ...Draft,
  ...Photo,
  ...Story,
  ...User,
  ...AboutAndContact,
};
