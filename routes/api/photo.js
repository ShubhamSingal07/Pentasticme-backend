const route = require("express").Router();

const { userAuthViaToken, adminAuth, readerAuth } = require("../../middlewares");
const { getPhotos, addPhotos, increaseLike, decreaseLike, editComment, deleteComment } = require("../../controllers");

route.get("/", userAuthViaToken, async (req, res) => {
  try {
    let photos = await getPhotos(12, req.query.start);
    if (req.user) {
      photos = photos.map(photo => {
        const isLiked = photo.likes.by.includes(req.user.id);
        return {
          ...photo,
          isLiked,
        };
      });
    }
    res.status(200).send({
      success: true,
      user: req.user,
      photos,
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
    await increaseLike(req.user.id, photoId);
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
    await decreaseLike(req.user.id, photoId);
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
    await addComment(req.user.id, req.user.username, photoId, req.body.comment);
    res.status(200).send({
      success: true,
      message: "Comment added successfully",
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

route.patch("/comment/edit/:commentId", readerAuth, async (req, res) => {
  try {
    await editComment(commentId, req.body.comment);
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

route.patch("/comment/delete/:photoId", readerAuth, async (req, res) => {
  try {
    await deleteComment(photoId, req.body.commentId);
    res.status(200).send({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later");
  }
});

module.exports = route;
