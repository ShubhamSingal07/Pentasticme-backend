const route = require("express").Router();

const { userAuthViaToken, adminAuth, readerAuth } = require("../../middlewares");
const {
  getStories,
  getStory,
  addStory,
  editStory,
  increaseClap,
  decreaseClap,
  getAllBookmarks,
} = require("../../controllers");
const { Story } = require("../../models/story");

// route to get the stories or story for story page
route.get("/", userAuthViaToken, async (req, res) => {
  try {
    const id = req.query.storyId;
    if (id) {
      const story = await getStory(id);
      let isBookmarked = false;
      if (req.user) {
        const bookmarks = await getAllBookmarks(req.user._id);
        if (bookmarks) isBookmarked = bookmarks.storyId.includes(id);
      }
      let isLiked = false;
      const claps = story.claps.total;
      if (req.user) {
        isLiked = story.claps.by.includes(req.user._id);
      }

      story._doc.claps = claps;
      story._doc.isLiked = isLiked;
      story._doc.isBookmarked = isBookmarked;

      return res.status(200).send({
        success: true,
        user: req.user,
        story,
      });
    } else {
      const stories = await getStories(10, req.query.page * 10);
      const count = await Story.countDocuments();
      return res.status(200).send({
        success: true,
        user: req.user,
        stories,
        pages: Math.ceil(count / 10),
      });
    }
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

// route to publish a story
route.post("/", adminAuth, async (req, res) => {
  try {
    const story = await addStory(req.body.title, req.body.body, req.body.image, req.body.description);
    res.status(201).send({
      success: true,
      storyId: story.id,
      message: "Story added successfully",
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

// route to edit a story
route.patch("/:storyId", adminAuth, async (req, res) => {
  try {
    const story = await editStory(
      req.params.storyId,
      req.body.title,
      req.body.body,
      req.body.image,
      req.body.description,
    );
    res.status(200).send({
      success: true,
      storyId: story.id,
      message: "Story successfully edited",
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

route.patch("/clap/:storyId", readerAuth, async (req, res) => {
  try {
    await increaseClap(req.user._id, req.params.storyId);
    res.status(200).send({
      success: true,
      message: "Increased claps for this story successfully",
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

route.patch("/unclap/:storyId", readerAuth, async (req, res) => {
  try {
    await decreaseClap(req.user._id, req.params.storyId);
    res.status(200).send({
      success: true,
      message: "Decreased claps for this story successfully",
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

module.exports = route;
