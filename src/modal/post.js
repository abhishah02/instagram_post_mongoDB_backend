const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema(
  {
    post_id: { type: String, require: true },
    image: { type: String, require: true },
    likes: { type: Number },
    shares: { type: Number },
    uid: { type: String },
  },
  { timestamps: true }
);

const Post = mongoose.model("post", PostSchema);

module.exports = Post;
