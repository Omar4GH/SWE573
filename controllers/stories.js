import { db } from "../db.js";
import jwt from "jsonwebtoken";
import cookieSession from 'cookie-session';
import express from 'express';

const authRouter = express.Router();

authRouter.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

export const getStories = (req, res) => {
  const q = req.query.year
    ? "SELECT * FROM stories WHERE year=?"
    : "SELECT * FROM stories";
  db.query(q, [req.query.year], (err, data) => {
    if (err) return err.status(500).send(err);

    return res.status(200).json(data);
  });
};

export const getStory = (req, res) => {
  const q =
    "SELECT s.id, `username`, `title`, `content`, s.img, u.img AS userImg, `year`, `postdate`, `geocode` FROM users u JOIN stories s ON u.id = s.uid WHERE s.id = ? ";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data[0]);
  });
};

export const postStory = (req, res) => {
 /* const token = req.cookies.geomemToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");*/

    const q =
      "INSERT INTO stories(`title`, `content`, `img`, `postdate`, `year`, `geocode`, `uid`) VALUES (?)";

    const values = [
      req.body.title,
      req.body.content,
      req.body.img,
      req.body.postdate,
      req.body.year,
      req.body.geocode,
      req.body.uid,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been created.");
    });
 // });
};

export const deleteStory = (req, res) => {

 // const token = req.session.geomemToken;
 // if (!token) return res.status(401).json("Not authenticated ! "+token);

//  jwt.verify(token, "jwtkey", (err, userInfo) => {
 //   if (err) return res.status(403).json("Token not valid ! "+token);

    const storyid = req.params.id;
    const q = "DELETE FROM stories WHERE `id` = ?";

    db.query(q, [storyid], (err, data) => {
      if (err)
        return res.status(403).json("You can't delete someone else's post ");

      return res.json("Post Deleted ! ");
    });
 // });
};

export const updateStory = (req, res) => {
  res.json("Story CONTROLLER");
};
