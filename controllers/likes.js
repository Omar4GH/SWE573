import { db } from "../db.js";


export const getLikes = (req, res) => {
    const q =
      "SELECT * FROM likes ";
    db.query(q,(err, data) => {
      if (err) return res.status(500).send(err);
  
      return res.status(200).json(data);
    });
  };
  

export const postLike = (req, res) => {

    const q =
      "INSERT INTO likes(`user_id`, `story_id`) VALUES (?)";

    const values = [
      req.body.user_id,
      req.body.story_id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Liked");
    });
 // });
};

export const deleteLike = (req, res) => {

     const likeid = req.params.id;
     const q = "DELETE FROM likes WHERE `id` = ?";
 
     db.query(q, [likeid], (err, data) => {
       if (err)
         return res.status(403).json("error ");
 
       return res.json("Unliked ! ");
     });
 };
 