const ObjectId = require("mongoose").Types.ObjectId;

const { Photo } = require("../models/photo");

const addPhotos = async url => {
  try {
    const res = await new Photo({
      url
    }).save();
    return res;
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

const getPhotos = async (limit, start = 0, user) => {
  try {
    const photos = await Photo.find({})
      .sort({
        createdAt: -1
      })
      .skip(start)
      .limit(limit);
    const data = await Promise.all(
      photos.map(async photo => {
        let isLiked = false;
        const totalComments = photo.comments.total;
        const totalLikes = photo.likes.total;
        if (user) {
          isLiked = await getIsLiked(photo._id, user._id);
        }
        photo._doc.comments = totalComments;
        photo._doc.likes = totalLikes;
        photo._doc.isLiked = isLiked;
        return {
          ...photo._doc
        };
      })
    );
    return data;
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

const getPhotosCount = async () => {
  try {
    return await Photo.countDocuments({});
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

const getIsLiked = async (photoId, userId) => {
  try {
    return await Photo.exists({
      _id: ObjectId(photoId),
      "likes.by.userId": userId
    });
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

const increaseLike = async (userId, username, photoId) => {
  try {
    await Photo.findByIdAndUpdate(photoId, {
      $inc: {
        "likes.total": 1
      },
      $push: {
        "likes.by": { userId, name: username }
      }
    });
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

const decreaseLike = async (userId, photoId) => {
  try {
    await Photo.findByIdAndUpdate(photoId, {
      $inc: {
        "likes.total": -1
      },
      $pull: {
        "likes.by": { userId }
      }
    });
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

// addComment
const addComment = async (userId, thumbnail, name, photoId, comment) => {
  try {
    const res = await Photo.findById(photoId);
    res.comments.total += 1;
    const data = res.comments.comment.push({
      userId,
      thumbnail,
      name,
      body: comment
    });
    const doc = await res.save();
    return doc.comments.comment[data - 1]._id;
  } catch (err) {
    throw new Error("Could not connect to Database.Please try again later.");
  }
};

const editComment = async (photoId, commentId, comment) => {
  try {
    await Photo.findOneAndUpdate(
      {
        _id: ObjectId(photoId),
        "comments.comment._id": ObjectId(commentId)
      },
      {
        $set: {
          "comments.comment.$.body": comment
        }
      }
    );
  } catch (err) {
    throw new Error("Could not connect to Database.Please try again later.");
  }
};

const deleteComment = async (photoId, commentId, userId) => {
  try {
    await Photo.findOneAndUpdate(
      { _id: ObjectId(photoId), "comments.comment.userId": userId },
      {
        $inc: {
          "comments.total": -1
        },
        $pull: {
          "comments.comment": { _id: ObjectId(commentId) }
        }
      }
    );
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

module.exports = {
  addPhotos,
  getPhotos,
  getPhotosCount,
  getPhoto,
  getIsLiked,
  increaseLike,
  decreaseLike,
  addComment,
  editComment,
  deleteComment
};
