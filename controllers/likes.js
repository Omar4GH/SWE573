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
    const q = "INSERT INTO likes(`user_id`, `story_id`) VALUES (?)";
  
    const values = [    req.body.user_id,    req.body.story_id,  ];
  
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
  
      updateStoryLikes(req.body.story_id);
  
      return res.json("Liked");
    });
  };
  

  export const deleteLike = (req, res) => {
    const likeid = req.params.id;
    const q = "DELETE FROM likes WHERE `id` = ?";
    
    db.query(q, [likeid], (err, data) => {
      if (err) {
        return res.status(403).json("error");
      }
  
      const storyId = req.params.storyid;
      updateStoryLikes(storyId);
  
      return res.json("Unliked!");
    });
  };
  
  
 

  export const updateStoryLikes = (storyId) => {
    const q = `
      UPDATE stories
      SET likes = (
        SELECT COUNT(*) FROM likes
        WHERE story_id = ?
      )
      WHERE id = ?
    `;
    db.query(q, [storyId, storyId], (err, data) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Updated like count for story ${storyId}`);
      }
    });
  };
  
  
