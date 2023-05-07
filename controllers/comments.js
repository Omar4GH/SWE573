import { db } from "../db.js";

import express from 'express';

export const getComments = (req, res) => {
    const q =
      "SELECT c.id, c.uid, `date_posted`, `comment`, `username`, u.img AS userImg FROM users u JOIN comments c ON c.uid = u.id WHERE c.sid = ? ";
    db.query(q, [req.params.sid], (err, data) => {
      if (err) return res.status(500).send(err);
  
      return res.status(200).json(data);
    });
  };
  

export const postComment = (req, res) => {

    const q =
      "INSERT INTO comments(`date_posted`, `comment`, `sid`, `uid`) VALUES (?)";

    const values = [
      req.body.date_posted,
      req.body.comment,
      req.body.sid,
      req.body.uid,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Comment has been created.");
    });
 // });
};

export const deleteComment = (req, res) => {

     const commentid = req.params.id;
     const q = "DELETE FROM comments WHERE `id` = ?";
 
     db.query(q, [commentid], (err, data) => {
       if (err)
         return res.status(403).json("Nope ");
 
       return res.json("Comment Deleted ! ");
     });
 };
 