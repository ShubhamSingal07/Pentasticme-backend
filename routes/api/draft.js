const route = require("express").Router();

const { getDrafts, getDraft, addToDrafts, removeFromDrafts, addStory } = require("../../controllers");
const { adminAuth } = require("../../middlewares");

route.get("/", adminAuth, async (req, res) => {
  try {
    const id = req.query.draftId;
    if (id) {
      const draft = await getDraft(id);
      return res.status(200).send({
        success: true,
        draft,
      });
    }
    const drafts = await getDrafts();
    res.status(200).send({
      success: true,
      drafts,
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

route.post("/", adminAuth, async (req, res) => {
  try {
    const draftId = await addToDrafts(req.body.draftId, req.body.title, req.body.body);
    res.status(200).send({
      success: true,
      draftId,
      message: "Successfully added to drafts",
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

route.post("/publish", adminAuth, async (req, res) => {
  try {
    await removeFromDrafts(req.body.draftId);
    const story = await addStory(req.body.title, dreq.body.body, req.body.image);
    res.status(200).send({
      success: true,
      storyId: story.id,
      message: "Draft published Successfully",
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

route.delete("/:draftId", adminAuth, async (req, res) => {
  try {
    await removeFromDrafts(draftId);
    res.status(200).send({
      success: true,
      message: "Draft successfully deleted",
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

module.exports = route;
