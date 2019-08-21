const route = require("express").Router();

const { userAuthViaToken, adminAuth } = require("../../middlewares");
const { getContact, addToContact } = require("../../controllers");

route.get("/", userAuthViaToken, async (req, res) => {
  try {
    const contact = await getContact();
    res.status(200).send({
      success: true,
      user: req.user,
      contact,
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

route.post("/", adminAuth, async (req, res) => {
  try {
    await addToContact(req.body.body);
    res.status(200).send({
      success: true,
      message: "Contact successfully added",
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

module.exports = route;
