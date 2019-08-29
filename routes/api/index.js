const route = require("express").Router();

route.use("/bookmark", require("./bookmark"));
route.use("/draft", require("./draft"));
route.use("/home", require("./home"));
route.use("/photo", require("./photo"));
route.use("/story", require("./story"));
route.use("/token", require("./token"));
route.use("/image", require("./image"));

module.exports = route;
