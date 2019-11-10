const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    title: String,
    body: String,
    description: String,
    image: String,
    date: String,
    claps: {
      total: { type: Number, default: 0 },
      by: [String],
    },
  },
  {
    timestamps: true,
  },
);

const Story = mongoose.model("Story", storySchema);

module.exports = {
  Story,
};
