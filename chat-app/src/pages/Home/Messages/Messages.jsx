import "./Messages.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import { makeRequest } from "../../../axios";
import socket from "../../../io";
import moment from "moment";

function Messages() {
  const { currentUser } = useContext(AuthContext);
  const [convList, setConvList] = useState([]);
  const [convRefresh, setConvRefresh] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    socket?.emit("addUser", currentUser.userID);
    socket.on("getUsers", (users) => { 
      setOnlineUsers(users=users.filter((user) => user.userID !== currentUser.userID)) 
    });
  }, [currentUser]);


  useEffect(() => {
    const getConvList = async () => {
      try {
        makeRequest.get(`/conversations/convList/${currentUser.userID}`).then((res) => {
          setConvList(res.data);
        })
      } catch (err) {
        console.log(err);
      }
    }
    getConvList();
  }, [convRefresh]);

  const handleBack = (e) => {
    e.preventDefault();
    navigate(-1);
  }

  const deleteConv = async (conversation_id) => {
    try {
      await makeRequest.delete(`/conversations/${conversation_id}`);
      console.log("Successfully Delete");
      setConvRefresh(!convRefresh)
    } catch (err) {
      console.log(err);
    }
  };

  return (
      <div className="messageCard">
      <header>
          <img src="/icons/back-b.png" onClick={handleBack}/>
          <h5>Messages</h5>
        </header>

        <div className="container">

          <div className="searchBar">
            <img src="/icons/search-gray.png" alt="search-icon"/>
            <input type="text" placeholder="Search..." />
          </div>

          <div className="group">
          {(Object.keys(convList)).length !== 0 ? convList?.map((c) => (
            <div key={c.conversation_id}>
                <Link  id="nav" to={`/messages/${c.conversation_id}/${c.receiverID}`}>
                  <div className="user">
                    <img className="userImg" 
                      src="/icons/default.jpg" alt="user-Image"/>
                    <div className="nameMsg">
                      <p>{c?.full_name}</p>
                      <span>{c?.last_message}</span>
                    </div>
                    <p className="sentAt">
                      {moment(c.sent_at).fromNow()}
                    </p>
                  </div>
                </Link>
                <img src="/icons/delete.png" alt="deleteIcon" onClick={() => deleteConv(c.conversation_id)}/>
                </div>))
            : <div className="noConversation">
                No Conversation
              </div>}
          </div>
        </div>
      </div>
  );
}

export default Messages;
