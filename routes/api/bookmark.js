const route = require("express").Router();

const { readerAuth } = require("../../middlewares");
const { getAllBookmarks, addToBookmarks, removeFromBookmarks, getStory } = require("../../controllers");

route.get("/", readerAuth, async (req, res) => {
  try {
    const bookmarks = await getAllBookmarks(req.user._id);
    const stories = bookmarks.storyId.map(async id => await getStory(id, true));
    console.log(stories);
    res.status(200).send({
      success: true,
      stories,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

route.post("/", readerAuth, async (req, res) => {
  try {
    await addToBookmarks(req.user._id, req.body.storyId);
    res.status(200).send({
      success: true,
      message: "Story added to bookmarks successfully",
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

route.delete("/:storyId", readerAuth, async (req, res) => {
  try {
    await removeFromBookmarks(req.user.id, storyId);
    res.status(200).send({
      success: true,
      message: "Story removed from bookmarks successfully",
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

module.exports = route;
