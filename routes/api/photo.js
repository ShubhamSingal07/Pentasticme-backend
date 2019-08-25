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
} = require("../../controllers");

route.get("/", userAuthViaToken, async (req, res) => {
  try {
    if (req.query.page) {
      let photos = await getPhotos(12, req.query.page * 12);
      if (req.user) {
        photos = photos.map(photo => {
          const isLiked = photo.likes.by.includes(req.user.id);
          const totalComments = photo.comments.total;
          const totalLikes = photo.likes.total;
          delete photo.comments;
          delete photo.likes;
          return {
            ...photo,
            isLiked,
            comments: totalComments,
            likes: totalLikes,
          };
        });
      }
      return res.status(200).send({
        success: true,
        user: req.user,
        photos,
      });
    }

    const photo = await getPhoto(req.query.photoId);
    if (req.user) {
      photo.isLiked = photo.likes.by.includes(req.user.id);
    }
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
    const commentId = await addComment(req.user.id, req.user.username, photoId, req.body.comment);
    res.status(200).send({
      success: true,
      commentId,
      message: "Comment added successfully",
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

route.patch("/comment/edit/:photoId", readerAuth, async (req, res) => {
  try {
    await editComment(req.body.commentId, req.body.comment);
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
