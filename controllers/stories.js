import { db } from "../db.js";
import jwt from "jsonwebtoken";
import cookieSession from "cookie-session";
import express from "express";

const authRouter = express.Router();

authRouter.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

export const getStories = (req, res) => {
  const q = req.query.userid
    ? "SELECT s.id, `username`, `title`, `content`, s.img, u.img AS userImg, s.uid, `year`, `fulldate`, `startdate`, `enddate`, `postdate`, `geocode`, `address`, `tags`, `likes` FROM users u JOIN stories s ON u.id = s.uid WHERE s.uid = ?"
    : buildFilterQuery(req.query);

  const params = [];

  if (req.query.userid) {
    params.push(req.query.userid);
  } else {
    if (req.query.year) {
      params.push(`%${req.query.year}%`);
    }

    if (req.query.title) {
      params.push(`%${req.query.title}%`);
    }

    if (req.query.tags) {
      params.push(`%${req.query.tags}%`);
    }
    if (req.query.beforeyear) {
      params.push(req.query.beforeyear);
    }
    if (req.query.afteryear) {
      params.push(req.query.afteryear);
    }
    if (req.query.selectedMonths && req.query.selectedMonths.length > 0) {
      const selectedMonthsArray = req.query.selectedMonths.split(",");
     // console.log(selectedMonthsArray);
      params.push(selectedMonthsArray);
    }
    if (req.query.selectedCountry) {
      params.push(`%${req.query.selectedCountry}%`);
    }
  }

  db.query(q, params, (err, data) => {
    if (err) return res.status(500).send(err);

    return res.status(200).json(data);
  });
};

////filter
const buildFilterQuery = ({
  year,
  title,
  tags,
  beforeyear,
  afteryear,
  selectedMonths,
  selectedCountry,
}) => {
  let filterQuery =
    "SELECT s.id, `username`, `title`, `content`, s.img, u.img AS userImg, s.uid, `year`, `fulldate`, `startdate`, `enddate`, `postdate`, `geocode`, `address`, `tags`, `likes` FROM users u JOIN stories s ON u.id = s.uid";
  let filters = [];

  if (year) {
    filters.push("year LIKE ?");
  }
  if (tags) {
    filters.push("tags LIKE ?");
  }
  if (title) {
    filters.push("title LIKE ?");
  }
  if (beforeyear) {
    filters.push("year < ?");
  }
  if (afteryear) {
    filters.push("year > ?");
  }
  if (selectedMonths && selectedMonths.length > 0) {
    
    filters.push("MONTH(STR_TO_DATE(fulldate, '%Y-%m-%d %H:%i:%s')) IN (?)");
  }
  if (selectedCountry) {
    filters.push("address LIKE ?");
  }
  if (filters.length > 0) {
    filterQuery += " WHERE " + filters.join(" AND ");
    
  }

  return filterQuery;
};

export const getStory = (req, res) => {
  const q =
    "SELECT s.id, `username`, `title`, `content`, s.img, u.img AS userImg, `year`, `postdate`, `fulldate`, `startdate`, `enddate`, `geocode`, `geocode2`, `geocode3`, `address`, `tags`, `likes`, `uid` FROM users u JOIN stories s ON u.id = s.uid WHERE s.id = ? ";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data[0]);
  });
};

export const getUserStories = (req, res) => {
  const uid = req.params.uid;
  if (!uid) {
    return res.status(400).json("Missing uid parameter");
  }

  const q = "SELECT * FROM stories WHERE uid = ?";
  db.query(q, [uid], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json("Database error");
    }

    if (data.length === 0) {
      return res.status(404).json("No stories found for uid " + uid);
    }

    return res.status(200).json(data);
  });
};

export const postStory = (req, res) => {
  const q =
    "INSERT INTO stories(`title`, `content`, `img`, `postdate`, `fulldate`, `startdate`, `enddate`, `year`, `geocode`,`geocode2`,`geocode3`, `address`, `tags`, `likes`, `uid`) VALUES (?)";

  const values = [
    req.body.title,
    req.body.content,
    req.body.img,
    req.body.postdate,
    req.body.fulldate,
    req.body.startdate,
    req.body.enddate,
    req.body.year,
    req.body.geocode,
    req.body.geocode2,
    req.body.geocode3,
    req.body.address,
    JSON.stringify(req.body.tags),
    req.body.likes,
    req.body.uid,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("Post has been created.");
  });
};

export const deleteStory = (req, res) => {
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
  const storyId = req.params.id;
  const q =
    "UPDATE stories SET `title`=?,`content`=?,`img`=?, `fulldate=?`, `year`=?,`geocode`=?,`geocode2`=?,`geocode3`=?,`address`=?,`tags`=? WHERE `id` = ?";
  const values = [
    req.body.title,
    req.body.content,
    req.body.img,
    req.body.year,
    req.body.geocode,
    req.body.geocode2,
    req.body.geocode3,
    req.body.address,
    JSON.stringify(req.body.tags),
    storyId,
  ];
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json("Story has been updated.");
  });
};
