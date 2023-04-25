import express from "express";
import {  postComment, getComments  } from "../controllers/comments.js";

const router = express.Router();

  //  router.get("/",getStories);
    router.get("/:sid",getComments);
    router.post("/",postComment);
//    router.delete("/:id",deleteStory);

export default router;