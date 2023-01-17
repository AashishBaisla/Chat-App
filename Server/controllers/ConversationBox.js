import { db } from "../dbConfig.js";
import jwt from "jsonwebtoken";

//new conv

export const newConv = (req, res) => {
  const query = `SELECT * FROM conversations 
  WHERE (user_id_1=? AND user_id_2=?) OR (user_id_1=? AND user_id_2=?) ;`
  const id1 = req.body.user_id_1 ;
  const id2 = req.body.user_id_2 ;
  console.log({"user1":id1, "user2:":id2});

    db.query(query, [id1, id2, id2, id1], (err, result) => {
      if(err) return res.status(500).json(err);

      if ((JSON.parse(JSON.stringify(result))).length) {
        return res.status(200).json(parseInt(JSON.parse(JSON.stringify(result[0].conversation_id))));
      }
      else {
        const q = "INSERT INTO conversations (`user_id_1`, `user_id_2`) VALUES (?)";
        const values = [id1, id2];

        db.query(q, [values], (err, result) => {
          if (err) return res.status(500).json(err);
          const conversation_id = (JSON.parse(JSON.stringify(result))).insertId ;
          return res.status(200).json(conversation_id);
        });
      }
    })

};


export const convList = (req, res) => {
  const id = req.params.userID ;
    const q = `SELECT 
      c.*,
      (SELECT userID FROM app_users WHERE userID = IF(user_id_2 = ?, user_id_1, user_id_2)) AS receiverID, 
      (SELECT full_name FROM app_users WHERE userID = IF(user_id_2 = ?, user_id_1, user_id_2)) AS full_name, 
      (SELECT msg FROM messages WHERE conversation_id = c.conversation_id ORDER BY sent_at DESC LIMIT 1) AS last_message,
      (SELECT sent_at FROM messages WHERE conversation_id = c.conversation_id ORDER BY sent_at DESC LIMIT 1) AS sent_at
      FROM conversations AS c
      JOIN app_users AS u 
      ON u.userID = (c.user_id_1 OR c.user_id_2)
      WHERE user_id_1 = ? OR user_id_2 = ? ;`

    db.query(q, [id, id, id, id, id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
};

export const deleteConversation = (req, res) => {
  const token = req.cookies.authtoken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
  
    const q = "DELETE FROM conversations WHERE `conversation_id`=?" ;

    db.query(q, [req.params.conversation_id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  })
};

