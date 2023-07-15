import { Router } from "express";
import multer, { memoryStorage } from "multer";
import { afterUserDelete, comentReply, deleteComment, deletePost, dislikePost, findAllComments, getAllPosts, getPostById, getReplyComment, likePost, postComment, postPost, removePortReport, reportPost, updateComment, updatePost, } from "../controllers/postController.js";
//Setup upload
const upload = multer({
    storage: memoryStorage(),
    limits: {
        fieldSize: 5 * 1024 * 1024,
    },
});
const postRouter = Router()
    .post("/", upload.array("images"), postPost)
    .get("/all", getAllPosts)
    .get("/one", getPostById)
    .put("/:postId", updatePost)
    .post("/comment", postComment)
    .post("/comment/reply", comentReply)
    .get("/comment/:idPost", findAllComments)
    .get("/comment/replies", getReplyComment)
    .put("/comment/:commentId", updateComment)
    .delete("/comment/:commentId", deleteComment)
    .post("/like", likePost)
    .delete("/like", dislikePost)
    .delete("/:postId", deletePost)
    .post("/report", reportPost)
    .delete("/report", removePortReport)
    .delete("/user", afterUserDelete);
export default postRouter;
