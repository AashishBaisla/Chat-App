import { db } from "../dbConfig.js";

//add

export const addMessage = (req, res) => {

  const q = "INSERT INTO messages (`conversation_id`, `sender_user_id`, `msg`) VALUES (?)";
  const values = [req.body.conversation_id, req.body.senderID, req.body.msg];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
        const insertId = (JSON.parse(JSON.stringify(data))).insertId ;
        const q = "SELECT * FROM messages WHERE message_id=?"

        db.query(q, [insertId], (err, data) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json(data[0]);
        })
    })
};

//get

export const getMessages = (req, res) => {
  const q =`SELECT m.*, u.* FROM messages AS m
    JOIN conversations AS c ON m.conversation_id = c.conversation_id
    JOIN app_users u ON m.sender_user_id = u.userID
    WHERE c.conversation_id = ?`;

  db.query(q, [req.params.conversation_id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });

};
