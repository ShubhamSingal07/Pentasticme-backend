const route = require("express").Router();

const { adminAuth } = require("../../middlewares");
const { getAllUsers, changeUserRole } = require("../../controllers/user");
const { getStoriesCount } = require("../../controllers/story");
const { getPhotosCount } = require("../../controllers/photo");

route.get("/", adminAuth, async (req, res) => {
  try {
    const users = getAllUsers();
    const storiesCount = getStoriesCount();
    const photosCount = getPhotosCount();
    const result = [await users, await storiesCount, await photosCount];
    return res.status(200).send({
      success: true,
      user: req.user,
      users: result[0],
      storiesCount: result[1],
      photosCount: result[2],
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

route.patch("/:userId", adminAuth, async (req, res) => {
  try {
    await changeUserRole(req.params.userId);
    return res.status(200).send({
      success: true,
      message: "User role successfully changed",
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

module.exports = route;
