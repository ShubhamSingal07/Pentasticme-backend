const route = require("express").Router();

route.use("/bookmark", require("./bookmark"));
route.use("/draft", require("./draft"));
route.use("/home", require("./home"));
route.use("/photo", require("./photo"));
route.use("/story", require("./story"));
route.use("/token", require("./token"));
route.use("/image", require("./image"));
route.use("/about", require("./about"));
route.use("/contact", require("./contact"));
route.use("/refresh", require("./refresh"));
route.use("/user", require("./user"));

module.exports = route;
