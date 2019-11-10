const { AboutAndContact } = require("../models/aboutAndContact");

const getAbout = async () => {
  try {
    const about = await AboutAndContact.find({}, { about: 1, aboutBackgroundImage: 1 });
    return about[0];
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later");
  }
};

const changeAboutBackgroundImage = async image => {
  try {
    await AboutAndContact.updateMany(
      {},
      {
        aboutBackgroundImage: image,
      },
    );
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

const addToAbout = async body => {
  try {
    await AboutAndContact.updateMany(
      {},
      { about: body },
      {
        upsert: true,
      },
    );
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later");
  }
};

const getContact = async () => {
  try {
    const contact = await AboutAndContact.find({}, { contact: 1 });
    return contact[0];
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later");
  }
};

const addToContact = async body => {
  try {
    await AboutAndContact.updateMany(
      {},
      { contact: body },
      {
        upsert: true,
      },
    );
  } catch (err) {
    throw new Error("Could not connect to Database.Please try again later");
  }
};

module.exports = {
  changeAboutBackgroundImage,
  getAbout,
  addToAbout,
  getContact,
  addToContact,
};
