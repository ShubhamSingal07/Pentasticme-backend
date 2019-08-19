const route = require("express").Router();

const { readerAuth } = require("../../middlewares");
const { getAllBookmarks, addToBookmarks, removeFromBookmarks, getStory } = require("../../controllers");

route.get("/", readerAuth, async (req, res) => {
  try {
    const bookmarks = await getAllBookmarks(req.user.id);
    const stories = bookmarks.storyId.map(id => getStory(id, true));
    res.status(200).send({
      success: true,
      user: req.user,
      stories,
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

route.post("/", readerAuth, async (req, res) => {
  try {
    await addToBookmarks(req.body.userId, req.body.storyId);
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
