const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema(
  {
    url: [{ url: String }],
    likes: {
      total: { type: Number, default: 0 },
      by: [{ userId: String, name: String }],
    },
    comments: {
      total: { type: Number, default: 0 },
      comment: [{ userId: String, thumbnail: String, name: String, body: String }],
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
