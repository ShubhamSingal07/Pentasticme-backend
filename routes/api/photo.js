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
      photos = photos.map(photo => {
        let isLiked = false;
        const totalComments = photo.comments.total;
        const totalLikes = photo.likes.total;
        const arr = photo.likes.by;
        if (req.user) {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].userId === req.user._id) {
              isLiked = true;
              break;
            }
          }
        }
        photo._doc.comments = totalComments;
        photo._doc.likes = totalLikes;
        photo._doc.isLiked = isLiked;
        return {
          photo,
        };
      });

      return res.status(200).send({
        success: true,
        user: req.user,
        photos,
      });
    }

    let isLiked = false;
    const photo = await getPhoto(req.query.photoId);
    if (req.user) {
      let arr = photo.likes.by;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].userId === req.user._id) {
          isLiked = true;
          break;
        }
      }
    }
    photo._doc.isLiked = isLiked;
    res.status(200).send({
      success: true,
      user: req.user,
      photo,
    });
  } catch (err) {
    console.log(array);
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
    console.log(err);
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
    const commentId = await addComment(req.user._id, req.user.username, req.params.photoId, req.body.comment);
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
    await deleteComment(req.params.photoId, req.body.commentId);
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
