const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema(
  {
    comment_id: { type: String, require: true },
    postId: { type: String, require: true },
    comment: { type: String },
    uid: { type: String },
  },
  { timestamps: true }
);

const Comment = mongoose.model("comment", CommentSchema);

module.exports = Comment;
