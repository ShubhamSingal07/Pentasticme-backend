const route = require("express").Router();
const cloudinary = require("cloudinary").v2;

const { adminAuth } = require("../../middlewares");

route.post("/upload", adminAuth, async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.file);
    console.log("printing image uploaded from cloudinary");
    console.log(result);
    res.status(200).send({
      success: true,
      result,
      message: "Imaage successfully uploaded",
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

module.exports = route;
