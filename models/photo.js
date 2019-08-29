const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema(
  {
    url: [String],
    likes: {
      total: { type: Number, default: 0 },
      by: [{ userId: String, name: String }],
    },
    comments: {
      total: { type: Number, default: 0 },
      comment: [{ commentId: String, userId: String, name: String, body: String }],
    },
  },
  {
    timestamps: true,
  },
);

const Photo = mongoose.model("Photo", photoSchema);

module.exports = {
  Photo,
};
