const route = require("express").Router();

const { userAuthViaToken, adminAuth } = require("../../middlewares");
const { getAbout, addToAbout } = require("../../controllers");

route.get("/", userAuthViaToken, async (req, res) => {
  try {
    const about = await getAbout();
    res.status(200).send({
      success: true,
      user: req.user,
      about: about || { about: "Wait until Admin writes about himself" }
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
      user: req.user
    });
  }
});

route.post("/", adminAuth, async (req, res) => {
  try {
    await addToAbout(req.body.body);
    res.status(200).send({
      success: true,
      message: "About successfully added"
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error"
    });
  }
});

module.exports = route;
