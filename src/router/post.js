const express = require("express");
const helper = require("../middleware/helper");
const router = express.Router();
const controllerPost = require("../controller/post");

router.post("/createPost", helper.checkUserToken, controllerPost.createPost);
router.post(
  "/getAllPostUserByID",
  helper.checkUserToken,
  controllerPost.getAllPostUserByID
);
router.post(
  "/getPostUserByID",
  helper.checkUserToken,
  controllerPost.getPostUserByID
);
router.post(
  "/addLikeOnPost",
  helper.checkUserToken,
  controllerPost.addLikeOnPost
);
router.post(
  "/addShareOnPost",
  helper.checkUserToken,
  controllerPost.addShareOnPost
);
router.post(
  "/addCommentOnPost",
  helper.checkUserToken,
  controllerPost.addCommentOnPost
);
router.post(
  "/countComment",
  helper.checkUserToken,
  controllerPost.countComment
);

module.exports = router;
