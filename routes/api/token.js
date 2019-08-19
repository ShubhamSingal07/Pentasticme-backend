const route = require("express").Router();

const { getUser } = require("../../controllers/user");
const { createJWT } = require("../../utils/jwt");

route.get("/", async (req, res) => {
  try {
    const user = await getUser(req.query.id);
    const token = createJWT(user);
    res.status(200).send({
      success: true,
      token,
      user,
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

module.exports = route;
