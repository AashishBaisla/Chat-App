import { db } from "../dbConfig.js";

export const getUserbyUsername = (req, res) => {
  const username = req.params.username;

    const q = (username == "undefined")
      ? "SELECT * FROM app_users WHERE userID=?"
      : "SELECT * FROM app_users WHERE username=?";

    const values = (username == "undefined")
      ? [userInfo.id]
      : [username]
    
    db.query(q, values, (err, result) => {
      if (err) return res.status(500).json(err);
      
      const { user_pass, ...info } = result[0] || {};
      return res.json(info);
  });
};

export const getUserbyuserID = (req, res) => {
  const userID = req.params.userID;
  const q = "SELECT * FROM app_users WHERE userID=?";

  db.query(q, [userID], (err, result) => {
    if (err) return res.status(500).json(err);
    
    const { user_pass, ...info } = result[0];
    return res.json(info);
  });
};

export const searchUsers = (req, res) => {
  const term = req.params.term;

  const query = `SELECT * FROM app_users WHERE full_name LIKE '%${term}%' OR username LIKE '%${term}%'`;
  
  db.query(query, [term], (err, result) => {
    if (err) return res.status(500).json(err);
      return res.json(result);
  });
};

export const getSuggestions = (req,res)=>{
  const userID = req.params.userID ;
  const q = `SELECT * FROM app_users WHERE NOT userID=?`;
  db.query(q, [userID], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};