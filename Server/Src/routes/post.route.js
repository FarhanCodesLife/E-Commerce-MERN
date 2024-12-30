import express from "express";
import { createPost, getAllPosts, getPostById, deletePost, editPost } from "../controllers/post.controllers.js";
import { authenticateUser } from "../controllers/user.controllers.js";

const router = express.Router();

router.post("/create", createPost);
router.get("/all", getAllPosts);
router.get("/:id", getPostById);
router.delete("/:id", authenticateUser, deletePost);
router.put("/:id", authenticateUser, editPost);

export default router;