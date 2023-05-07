import express from "express";
import {  postComment, getComments, deleteComment  } from "../controllers/comments.js";

const router = express.Router();

  //  router.get("/",getStories);
    router.get("/:sid",getComments);
    router.post("/",postComment);
    router.delete("/:id",deleteComment);

export default router;