const { Story } = require("../models/story");

const getStories = async (limit, start = 0) => {
  try {
    return await Story.find({}, { title: 1, image: 1 }, { $sort: { updatedAt: -1 }, $limit: limit, skip: start });
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

const getStory = async (id, bookmark = false) => {
  try {
    if (!bookmark) return await Story.findById(id);
    return await Story.findById(id, { title: 1, image: 1 });
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

const addStory = async (title, body, image) => {
  try {
    const newStory = new Story({
      title,
      body,
      image,
    });
    return await newStory.save();
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

const editStory = async (id, title, body, image) => {
  try {
    return await Story.findByIdAndUpdate(
      id,
      { title, body, image },
      {
        new: true,
      },
    );
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

const increaseClap = async (userId, storyId) => {
  try {
    await Story.findByIdAndUpdate(storyId, {
      $inc: {
        "claps.total": 1,
      },
      $push: {
        "claps.by": userId,
      },
    });
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

const decreaseClap = async (userId, storyId) => {
  try {
    await Story.findByIdAndUpdate(storyId, {
      $inc: {
        "claps.total": -1,
      },
      $pull: {
        "claps.by": userId,
      },
    });
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

module.exports = {
  getStories,
  getStory,
  addStory,
  editStory,
  increaseClap,
  decreaseClap,
};
