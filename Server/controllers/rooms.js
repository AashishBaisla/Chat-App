import { db } from "../dbConfig.js";

export const newRoom = (req, res) => {
    
    const roomName = req.body.roomname ;

    const q = "INSERT INTO rooms (`room_name`) VALUES (?)";

    db.query(q, [roomName], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Room Created Successfully");
    });
}

export const roomsList = (req, res) => {
    const q = `SELECT * FROM rooms ;`

    db.query(q, [], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
};

export const deleteRoom = (req, res) => {

    const q = "DELETE FROM rooms WHERE `room_id`=?" ;

    db.query(q, [req.params.room_id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
};

export const addMessages = (req, res) => {

    const q = "INSERT INTO room_messages (`room_id`, `sender_user_id`, `msg`) VALUES (?)";
    const values = [req.body.room_id, req.body.senderID, req.body.msg];
  
      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
          const insertId = (JSON.parse(JSON.stringify(data))).insertId ;
          const q = "SELECT * FROM room_messages WHERE message_id=?"
  
          db.query(q, [insertId], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data[0]);
          })
      })
  };

export const getRoomMessages = (req, res) => {

    const q =`SELECT m.*, u.*
    FROM room_messages AS m
    JOIN rooms AS r 
    ON m.room_id = r.room_id
    JOIN app_users AS u ON m.sender_user_id = u.userID
    WHERE r.room_id = ?`;

  db.query(q, [req.params.room_id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const joinRoom = (req, res) => {
    const q =`INSERT INTO room_members (room_id, user_id) VALUES (?)`;
    const values = [req.body.room_id, req.body.user_id]
  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Join Successfully");
  });
};

export const leaveRoom = (req, res) => {
    const q ="DELETE FROM room_members WHERE `room_id` = ? AND `user_id`=?";

  db.query(q, [req.body.room_id, req.body.user_id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Leave Successfully");
  });
};

export const roomJoined = (req, res) => {
    const q =`SELECT room_id FROM room_members WHERE user_id=?;`;
    const values = [req.params.user_id]
  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const roomInfo = (req, res) => {
    const q =`SELECT * FROM rooms WHERE room_id=?;`;

  db.query(q, [req.params.room_id], (err, data) => {
    if (err) return res.status(500).json(err);
    const dataa = (JSON.parse(JSON.stringify(data)));
    return res.status(200).json(dataa[0].room_name);
  });
};

