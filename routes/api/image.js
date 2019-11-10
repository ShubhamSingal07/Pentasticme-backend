const route = require("express").Router();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const { adminAuth, upload } = require("../../middlewares");
const { changeAboutBackgroundImage } = require("../../controllers/aboutAndContact");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

route.post("/upload", adminAuth, upload.any(), async (req, res) => {
  try {
    const images = [];
    for (let file of req.files) {
      const path = file.path;
      const uniqueFileName = new Date().toISOString();
      const image = await cloudinary.uploader.upload(path, {
        public_id: `photos/${uniqueFileName}`,
        tags: "photos",
      });
      fs.unlinkSync(path);
      images.push({ url: image.secure_url });
    }
    if (req.body.editBackgroundImage !== "undefined") await changeAboutBackgroundImage(images[0].url);
    res.status(200).send({
      success: true,
      image: images,
      message: "Image successfully uploaded",
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

module.exports = route;
