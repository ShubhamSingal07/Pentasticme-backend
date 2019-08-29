const uuid = require("uuid/v4");
const ObjectId = require("mongoose").Types.ObjectId;

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
    const photos = await Photo.find({})
      .sort({
        updatedAt: -1.0,
      })
      .skip(start)
      .limit(limit);
    return photos;
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

const getPhoto = async photoId => {
  try {
    return await Photo.findById(photoId);
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

const increaseLike = async (userId, username, photoId) => {
  try {
    await Photo.findByIdAndUpdate(photoId, {
      $inc: {
        "likes.total": 1,
      },
      $push: {
        "likes.by": { userId, name: username },
      },
    });
  } catch (err) {
    console.log(err);
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

const decreaseLike = async (userId, photoId) => {
  try {
    console.log(userId, photoId);
    await Photo.findByIdAndUpdate(photoId, {
      $inc: {
        "likes.total": -1,
      },
      $pull: {
        "likes.by": { userId },
      },
    });
  } catch (err) {
    console.log(err);
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

// addComment
const addComment = async (userId, name, photoId, comment) => {
  try {
    const commentId = uuid();
    await Photo.findByIdAndUpdate(photoId, {
      $inc: {
        "comments.total": 1,
      },
      $push: {
        "comments.comment": {
          commentId,
          userId,
          name,
          body: comment,
        },
      },
    });
    return commentId;
  } catch (err) {
    throw new Error("Could not connect to Database.Please try again later.");
  }
};

const editComment = async (photoId, commentId, comment) => {
  try {
    await Photo.findOneAndUpdate(
      {
        _id: ObjectId(photoId),
        "comments.comment.commentId": commentId,
      },
      {
        $set: {
          "comments.comment.$.body": comment,
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
      $inc: {
        "comments.total": -1,
      },
      $pull: {
        "comments.comment": { commentId },
      },
    });
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

module.exports = {
  addPhotos,
  getPhotos,
  getPhoto,
  increaseLike,
  decreaseLike,
  addComment,
  editComment,
  deleteComment,
};
