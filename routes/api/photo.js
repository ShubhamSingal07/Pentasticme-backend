const route = require("express").Router();

const { userAuthViaToken, adminAuth, readerAuth } = require("../../middlewares");
const {
  getPhotos,
  getPhoto,
  addPhotos,
  increaseLike,
  decreaseLike,
  editComment,
  deleteComment,
  addComment,
  getIsLiked,
} = require("../../controllers");
const { Photo } = require("../../models/photo");

route.get("/", userAuthViaToken, async (req, res) => {
  try {
    if (req.query.page) {
      const photos = await getPhotos(12, req.query.page * 12, req.user);
      const count = await Photo.countDocuments();
      return res.status(200).send({
        success: true,
        user: req.user,
        photos,
        pages: Math.ceil(count / 10),
      });
    }

    let isLiked = false;
    const photo = await getPhoto(req.query.photoId);
    if (req.user) {
      isLiked = await getIsLiked(photo._id, req.user._id);
    }
    photo._doc.isLiked = isLiked;

    res.status(200).send({
      success: true,
      user: req.user,
      photo,
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

route.post("/", adminAuth, async (req, res) => {
  try {
    await addPhotos(req.body.url);
    res.status(200).send({
      success: true,
      message: "Photos added successfully",
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

route.patch("/like/:photoId", readerAuth, async (req, res) => {
  try {
    await increaseLike(req.user._id, req.user.username, req.params.photoId);
    res.status(200).send({
      success: true,
      message: "Photo liked successfully",
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

route.patch("/dislike/:photoId", readerAuth, async (req, res) => {
  try {
    await decreaseLike(req.user._id, req.params.photoId);
    res.status(200).send({
      success: true,
      message: "Photo disliked successfully",
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

route.patch("/comment/add/:photoId", readerAuth, async (req, res) => {
  try {
    const commentId = await addComment(
      req.user._id,
      req.user.thumbnail,
      req.user.username,
      req.params.photoId,
      req.body.comment,
    );
    res.status(200).send({
      success: true,
      commentId,
      message: "Comment added successfully",
    });
  } catch (err) {
    console.log(err)
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

route.patch("/comment/edit/:photoId", readerAuth, async (req, res) => {
  try {
    await editComment(req.params.photoId, req.body.commentId, req.body.comment);
    res.status(200).send({
      success: true,
      message: "Comment edited successfully",
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

route.delete("/comment/:photoId", readerAuth, async (req, res) => {
  try {
    await deleteComment(req.params.photoId, req.body.commentId, req.user._id);
    res.status(200).send({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

module.exports = route;
