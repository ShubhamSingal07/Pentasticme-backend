const mongoose = require("mongoose");

const draftSchema = new mongoose.Schema(
  {
    title: String,
    body: String,
  },
  {
    timestamps: true,
  },
);

const Draft = mongoose.model("Draft", draftSchema);

module.exports = {
  Draft,
};
