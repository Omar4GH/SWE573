import express from "express";
import { deleteStory, getStories, getStory, postStory, updateStory, getUserStories } from "../controllers/stories.js";

const router = express.Router();

    router.get("/",getStories);
    router.get("/:id",getStory);
    router.get("/user/:uid",getUserStories);
    router.post("/",postStory);
    router.delete("/:id",deleteStory);
    router.put("/:id",updateStory);

export default router;