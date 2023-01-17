import "./ChatBox.css";
import { useEffect, useState, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { makeRequest } from "../../../axios";
import { AuthContext } from "../../../context/authContext";
import moment from "moment";
import socket from "../../../io";

const ChatBox = () => {
  const {currentUser} = useContext(AuthContext) ;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollRef = useRef();
  const [userInfo, setUserInfo] = useState([]);

  const conversation_id = parseInt(useLocation().pathname.split("/")[2]);
  const receiverID = parseInt(useLocation().pathname.split("/")[3]);

  useEffect(() => {
    socket.on("getMessage", (data) => {
      setArrivalMessage({
        sender_user_id: data.senderID,
        msg: data.msg,
        sent_at: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage && receiverID===arrivalMessage.sender_user_id
      && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    const getuserInfo = async () => {
      try {
        makeRequest.get("/users/userID/" + receiverID).then((res) => {
          setUserInfo(res.data);
        })
      } catch (err) {
        console.log(err);
      }
    }
    const getMessages = async () => {
      try {
        const res = await makeRequest.get(`/messages/${conversation_id}`);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getuserInfo();
    getMessages();
  }, [conversation_id]);

  const handleSubmit = async (e) => {

    const message = {
        conversation_id,
        senderID: currentUser.userID,
        msg: newMessage
    };

    socket.emit("sendMessage", {
        senderID: currentUser.userID,
        receiverID,
        msg: newMessage,
    });

  try {
    const res = await makeRequest.post("/messages", message);
    console.log(res.data);
    setMessages([...messages, res.data]);
    setNewMessage("");
  } catch (err) {
    console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const navigate = useNavigate();
    const handleBack = (e) => {
      e.preventDefault();
      navigate(-1);
    }

  return (
    <div className="chatCard">
      <header>
            <img className="backIcon"
                src="/icons/back-b.png"
                onClick={handleBack} alt="back-icon"/>
            <div className="userReceiver">
              <img className="profilePhoto" src="/icons/default.jpg" alt="" />
                <div className="details">
                  <span>{userInfo.full_name}</span>
                  <p>{userInfo.username}</p>
              </div>
            </div>
      </header>
    

      <div className="container">
        {(Object.keys(messages)).length !== 0 ? 
          messages.map((m, i) => (
              <div ref={scrollRef} key={i} className={(m.sender_user_id === currentUser.userID)
                ? "chat outgoing" : "chat incoming"}>
                  {(m.sender_user_id !== currentUser.userID)
                  &&  <div className="image">
                        <img className="recieverImage" src="/icons/default.jpg"/> 
                      </div>}

                    <div className="msg">
                      <p>{m.msg}</p>
                      <span>{moment(m.sent_at).format("h:mm a")}</span>
                    </div>
              </div>
        ))
        : <div className="noMessages">
            No Messages
          </div>
        }
      </div>

      <div className="typingArea">
        <input
          type="text"
          name="message"
          className="input-field"
          placeholder="Message.."
          autoComplete="off"
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
                handleSubmit();
            }
        }}
          value={newMessage}
        />
        {newMessage ?
        <img className="sendButton" src="/icons/send-color.png" onClick={handleSubmit}/>
        : "" }
      </div>
    </div>
  );
}

export default ChatBox;