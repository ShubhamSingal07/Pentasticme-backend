const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  userId: String,
  storyId: [ String ],
});

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

module.exports = {
  Bookmark,
};
