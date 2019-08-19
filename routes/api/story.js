const route = require("express").Router();

const { userAuthViaToken, adminAuth, readerAuth } = require("../../middlewares");
const { getStories, getStory, addStory, editStory, increaseClap, decreaseClap } = require("../../controllers");

// route to get the stories or story for story page
route.get("/", userAuthViaToken, async (req, res) => {
  try {
    const id = req.query.storyId;
    if (id) {
      const story = await getStory(id);
      let isLiked = false;
      const claps = story.claps.total;
      if (req.user) {
        isLiked = story.claps.by.includes(req.user.id);
      }
      delete story.claps;
      res.status(200).send({
        success: true,
        user: req.user,
        story: {
          ...story,
          isLiked,
          claps,
        },
      });
    } else {
      const stories = await getStories(10, req.query.start);
      res.status(200).send({
        success: true,
        user: req.user,
        stories,
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
    const story = await addStory(req.body.title, req.body.body, reqbody.image);
    res.status(201).send({
      success: true,
      story: story.id,
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
    const story = await editStory(storyId, req.body.title, req.body.body, req.body.image);
    res.status(200).send({
      success: true,
      story: story.id,
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
    await increaseClap(req.user.id, storyId);
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

route.patch("/unclap/:storyId", readerauth, async (req, res) => {
  try {
    await decreaseClap(req.user.id, storyId);
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

module.exports = route;
