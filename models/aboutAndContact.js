const mongoose = require("mongoose");

const aboutAndContactSchema = new mongoose.Schema({
  about: String,
  contact: String,
  aboutBackgroundImage: String,
});

const AboutAndContact = mongoose.model("aboutAndContact", aboutAndContactSchema);

module.exports = {
  AboutAndContact,
};
