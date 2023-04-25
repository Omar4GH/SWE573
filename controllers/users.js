import { db } from "../db.js";
import express from 'express';

const authRouter = express.Router();


export const updateUser = (req, res) => {

    const userId = req.params.id;
    const q =
      "UPDATE users SET `bio`=?,`birthdate`=?,`img`=?,`address`=? WHERE `id` = ?";

    const values = [req.body.bio, req.body.birthdate, req.body.img, req.body.address];

    db.query(q, [...values, userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("User has been updated.");
    });
};