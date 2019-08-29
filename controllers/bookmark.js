const { Bookmark } = require("../models/bookmark");

const addToBookmarks = async (userId, storyId) => {
  try {
    console.log(userId)
    await Bookmark.findOneAndUpdate({ userId }, { $push: { storyId } }, { upsert: true });
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

const getAllBookmarks = async userId => {
  try {
    // console.log(userId);
    const res = await Bookmark.findOne({ userId });
    return res;
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

const removeFromBookmarks = async (userId, storyId) => {
  try {
    await Bookmark.findOneAndUpdate({ userId }, { $pull: { storyId } });
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later");
  }
};

module.exports = {
  addToBookmarks,
  getAllBookmarks,
  removeFromBookmarks,
};
