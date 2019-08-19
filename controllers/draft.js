const { Draft } = require("../models/draft");

const getDrafts = async () => {
  try {
    const drafts = await Draft.find({}, { title: 1 });
    return drafts;
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

const getDraft = async id => {
  try {
    const draft = await Draft.findById(id);
    return draft;
  } catch (err) {
    throw new Error("Could not connect to database. Please try again later.");
  }
};

const addToDrafts = async (id, title, body) => {
  try {
    await Draft.findByIdAndUpdate(
      id,
      { title, body },
      {
        upsert: true,
      },
    );
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

const removeFromDrafts = async id => {
  try {
    await Draft.findByIdAndDelete(id);
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

module.exports = {
  getDrafts,
  getDraft,
  addToDrafts,
  removeFromDrafts,
};
