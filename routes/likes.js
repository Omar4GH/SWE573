import express from "express";
import {  postLike, deleteLike, getLikes  } from "../controllers/likes.js";

const router = express.Router();

  //  router.get("/",getStories);
    router.get("/",getLikes);
    router.post("/",postLike);
    router.delete("/:id",deleteLike);

export default router;