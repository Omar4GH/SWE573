import express from "express";
import { updateUser } from "../controllers/users.js";

const router = express.Router();

    
    router.put("/:id",updateUser);

export default router;