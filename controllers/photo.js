const uuid = require("uuid/v4");

const { Photo } = require("../models/photo");

const addPhotos = async url => {
  try {
    const res = await new Photo({
      url,
    }).save();
    return res;
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

const getPhotos = async (limit, start = 0) => {
  try {
    const photos = await Photo.find({}, { $sort: { updatedAt: -1 }, $limit: limit, skip: start });
    return photos;
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

const increaseLike = async (userId, photoId) => {
  try {
    await Photo.findByIdAndUpdate(photoId, {
      $inc: {
        "likes.total": 1,
      },
      $push: {
        "likes.by": userId,
      },
    });
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

const decreaseLike = async (userId, photoId) => {
  try {
    await Photo.findByIdAndUpdate(photoId, {
      $inc: {
        "likes.total": -1,
      },
      $pull: {
        "likes.by": userId,
      },
    });
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

// addComment
const addComment = async (userId, name, photoId, comment) => {
  try {
    await Photo.findByIdAndUpdate(photoId, {
      $inc: {
        "comments.total": 1,
      },
      $push: {
        "comments.comment": {
          commentId: uuid(),
          userId,
          name,
          body: comment,
        },
      },
    });
  } catch (err) {
    throw new Error("Could not connect to Database.Please try again later.");
  }
};

const editComment = async (commentId, comment) => {
  try {
    await Photo.findOneAndUpdate(
      { "commments.comment.commentId": commentId },
      {
        $set: {
          "comments.$.comment.$.body": comment,
        },
      },
    );
  } catch (err) {
    throw new Error("Could not connect to Database.Please try again later.");
  }
};

const deleteComment = async (photoId, commentId) => {
  try {
    await Photo.findByIdAndUpdate(photoId, {
      $pull: {
        "comments.comment.commentId": commentId,
      },
    });
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

module.exports = {
  addPhotos,
  getPhotos,
  increaseLike,
  decreaseLike,
  addComment,
  editComment,
  deleteComment,
};
