const { Story } = require("../models/story");

const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getStories = async (limit, start = 0) => {
  try {
    return await Story.find({}, { title: 1, image: 1, description: 1, date: 1 })
      .sort({
        createdAt: -1,
      })
      .skip(start)
      .limit(limit);
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

const getStoriesCount = async () => {
  try {
    return await Story.countDocuments({});
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

const getStory = async (id, bookmark = false) => {
  try {
    if (!bookmark) return await Story.findById(id);
    return await Story.findById(id, { title: 1, image: 1, date: 1, description: 1 });
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

const addStory = async (title, body, image, description) => {
  try {
    const today = new Date();
    const newStory = new Story({
      title,
      body,
      image,
      description,
      date: `${today.getDate()} ${monthArr[today.getMonth()]} ${today.getFullYear()}`,
    });
    return await newStory.save();
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

const editStory = async (id, title, body, image, description) => {
  try {
    return await Story.findByIdAndUpdate(
      id,
      { title, body, image, description },
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
  getStoriesCount,
  getStory,
  addStory,
  editStory,
  increaseClap,
  decreaseClap,
};
