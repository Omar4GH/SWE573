import { db } from "../db.js";
import express from 'express';

const authRouter = express.Router();



  
export const getUsers = (req, res) => {


  const q = req.query.name 
  ? "SELECT `id`, `username`, `img`, `bio`, `birthdate`, `posts`, `followers`, `following`, `country` FROM users WHERE username LIKE ?":
  "SELECT `id`, `username`, `img`, `bio`, `birthdate`, `posts`, `followers`, `following`, `country` FROM users ";
  db.query(q,[`%${req.query.name}%`],(err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json("Database error" );
    }


    return res.status(200).json(data);
  });
};



export const updateUser = (req, res) => {

    const userId = req.params.id;
    const q =
      "UPDATE users SET `bio`=?,`birthdate`=?,`img`=?,`country`=? WHERE `id` = ?";

    const values = [req.body.bio, req.body.birthdate, req.body.img, req.body.country];

    db.query(q, [...values, userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("User has been updated.");
    });
};


export const getUser = (req, res) => {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json( "Missing id parameter");
    }
  
    const q = "SELECT `id`, `username`, `img`, `bio`, `birthdate`, `posts`, `followers`, `following`, `country` FROM users WHERE id = ?";
    db.query(q, [id], (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json("Database error" );
      }
  
  
      return res.status(200).json(data[0]);
    });
  };