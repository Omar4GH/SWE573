import express from "express";
import { updateUser, getUser, getUsers } from "../controllers/users.js";

const router = express.Router();

    router.get("/",getUsers);
    router.get("/:id",getUser);
    router.put("/:id",updateUser);

export default router;