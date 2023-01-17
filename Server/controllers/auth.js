import { db } from "../dbConfig.js";

export const register = (req, res) => {
  const {fullname, username, password, cpassword} = req.body ;
  if (!(fullname && username && password && cpassword)) {
    return res.status(400).json({
      type: "warning",
      message: "All fields are required"
    })
  };

  if (!/^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/i.test(username)) {
    return res.status(400).json({
      type: "warning",
      message: "Invalid Username"
    })
  };
  if (!(password===cpassword)) {
    return res.status(400).json({
      type: "warning",
      message: "Password doesn't match"
    })
  };
  
  const q1 = "SELECT * FROM app_users WHERE username = ?";

  db.query(q1, [username], (err, result) => {
    if(err) return res.status(500).json(err);
    
    if (result.length) {
        return res.status(400).json({
          type: "warning",
          message: "Username already exist"
        })
      }

    const q2 = "INSERT INTO app_users (full_name, username, user_pass) VALUES (?, ?, ?)";

    db.query(q2, [fullname, username, password], (err, result) => {
      if(err) return res.json(err);
      return res.status(201).json({ 
        type: "success",
        message: "Registered Successfully"
      });
    });
  });
};


export const login = (req, res) => {

  const {username, password} = req.body ;
  const q = "SELECT userID, username, user_pass FROM app_users WHERE username = ?"
  
  db.query(q, [username], (err, result) => {
    
    if (err) return res.status(500).json(err);
    
    if (result.length === 0) {
      return res.status(404).json("User not found!");
    }

    if (result[0].user_pass != password) {
      return res.status(400).json("Incorrect password or username")
    }

    const { user_pass, ...userInfo } = result[0];
            
    res.status(200).json(userInfo)
  })
};
  