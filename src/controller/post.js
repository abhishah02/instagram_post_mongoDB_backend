const { v4 } = require("uuid");
const Post = require("../modal/post");
const fs = require("fs");
const path = require("path");
const Comment = require("../modal/comment");

async function createPost(req, res) {
  try {
    const { uid } = req.body;
    const image = req.files.image;

    let date = new Date();
    const [month, day, year] = [
      date.getMonth(),
      date.getDate(),
      date.getFullYear(),
    ];
    var dirName = day + "-" + month + "-" + year;

    var data = {
      post_id: v4(),
      uid: uid,
      likes: 0,
      shares: 0,
    };

    var cData = {
      comment_id: v4(),
      postId: data.post_id,
      comment: "",
      uid: uid,
    };

    let dir_path, upload_path;
    if (image) {
      dir_path = "/post_image/" + dirName + "/";
      upload_path = process.cwd() + "/public" + dir_path;
      if (!fs.existsSync(upload_path)) {
        fs.mkdirSync(upload_path, { recursive: true });
      }
      var image_name = date.getTime() + path.extname(image.name);
      var uploadPath = upload_path + image_name;
      image.mv(uploadPath, function (err) {
        if (err) {
          return res.status(500).send(err);
        }
      });
      data.image = dir_path + image_name;
    }

    await Post.create(data);
    await Comment.create(cData);

    return res.json({ st: true, msg: "Post created" });
  } catch (err) {
    return res.json({
      st: true,
      msg: err.message,
    });
  }
}

async function getAllPostUserByID(req, res) {
  try {
    const { uid } = req.body;
    const getPost = await Post.find({ uid: uid });
    return res.json({ st: true, data: getPost });
  } catch (err) {
    return res.json({
      st: true,
      msg: err.message,
    });
  }
}

async function getPostUserByID(req, res) {
  try {
    const { uid, postId } = req.body;
    const getPost = await Post.findOne({ uid: uid, post_id: postId });
    return res.json({ st: true, data: getPost });
  } catch (err) {
    return res.json({
      st: true,
      msg: err.message,
    });
  }
}

async function addLikeOnPost(req, res) {
  try {
    const { postId } = req.body;
    const findPost = await Post.findOne({ post_id: postId });
    console.log(findPost);
    var likeCount = parseInt(findPost.likes) + 1;

    await Post.findOneAndUpdate({ likes: likeCount });
    return res.json({ st: true, msg: "You Like The Post" });
  } catch (err) {
    return res.json({
      st: true,
      msg: err.message,
    });
  }
}
async function addShareOnPost(req, res) {
  try {
    const { postId } = req.body;
    const findPost = await Post.findOne({ post_id: postId });
    var shareCount = parseInt(findPost.shares) + 1;

    await Post.findOneAndUpdate({ likes: shareCount });
    return res.json({ st: true, msg: "You Share The Post" });
  } catch (err) {
    return res.json({
      st: true,
      msg: err.message,
    });
  }
}

async function addCommentOnPost(req, res) {
  try {
    const { postId, comment, uid } = req.body;

    const findPost = await Comment.findOne({ postId: postId });
    console.log(findPost);

    if (findPost.comment === "") {
      await Comment.findOneAndUpdate(
        { postId: postId },
        { $set: { comment: comment, uid: uid } }
      );
    } else {
      await Comment.create({
        comment_id: v4(),
        postId: findPost.postId,
        comment: comment,
        uid: uid,
      });
    }

    return res.json({ st: true, msg: "You Commect The Post" });
  } catch (err) {
    return res.json({
      st: true,
      msg: err.message,
    });
  }
}

async function countComment(req, res) {
  try {
    const { postId } = req.body;

    const findLikeAndShare = await Post.findOne({ post_id: postId });

    const findPost = await Post.aggregate([
      {
        $match: {
          post_id: postId,
        },
      },
      {
        $project: {
          post_id: 1,
          image: 1,
          uid: 1,
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "post_id",
          foreignField: "postId",
          as: "Comments",
          pipeline: [{ $project: { comment: 1 } }],
        },
      },
    ]);

    if (findLikeAndShare === null) {
      return res.json({ st: false, msg: "Post Not Found Or Invalid" });
    }

    return res.json({
      st: true,
      commentCount: findPost,
      likeCount: findLikeAndShare.likes,
      shareCount: findLikeAndShare.shares,
    });
  } catch (err) {
    return res.json({
      st: true,
      msg: err.message,
    });
  }
}

const post = {
  createPost,
  getAllPostUserByID,
  getPostUserByID,
  addLikeOnPost,
  addShareOnPost,
  addCommentOnPost,
  countComment,
};
module.exports = post;
