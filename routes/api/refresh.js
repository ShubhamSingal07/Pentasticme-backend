const route = require("express").Router();

const { adminAuth } = require("../../middlewares");

route.get("/", adminAuth, (req, res) => {
  res.status(200).send({
    success: true,
    user: req.user,
  });
});

module.exports = route;
