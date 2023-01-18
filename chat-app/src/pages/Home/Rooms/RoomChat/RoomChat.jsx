import "./RoomChat.css";
import { useEffect, useState, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { makeRequest } from "../../../../axios";
import { AuthContext } from "../../../../context/authContext";
import moment from "moment";
import socket from "../../../../io";

const RoomChat = () => {
  const {currentUser} = useContext(AuthContext) ;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  const [userInfo, setUserInfo] = useState([]);
  const [currUserdata, setCurrUserData] = useState()
  const [userJoin, setUserJoin] = useState([]);
  const [roomInfo, setRoomInfo] = useState();

  const room_id = parseInt(useLocation().pathname.split("/")[2]);

  useEffect(() => {
    const getData = async () => {
      try {
        await makeRequest.get(`/users/userID/${currentUser.userID}`).then((res) => {
          setCurrUserData(res.data);
        })
      } catch (err) {
        console.log(err);
      }
    }
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        await makeRequest.get(`/rooms/roominfo/${room_id}`).then((res) => {
            setRoomInfo(res.data);
            console.log({"roominfo:":roomInfo})
        })
      } catch (err) {
        console.log(err);
      }
    }
    getData();
  }, []);


  useEffect(() => {
    socket?.emit("joinRoom", room_id);
  }, [currentUser]);

  useEffect(() => {
    socket.on("JoinMessage", (data) => {
      setUserJoin({
        room_id: data.room,
        user: data.user,
        text: data.text,
        sent_at: Date.now(),
      });
    });
  }, []);

  /*{userJoin?.map((u, i) => (
    <div key={i}>
        {userJoin.user}<br/>{userJoin.text}
    </div>
))}
  useEffect(() => {
    userJoin && room_id===userJoin.room_id
      && setUserJoin((prev) => [...prev, userJoin]);
  }, [userJoin]);*/

  useEffect(() => {
    socket.on("getRoomMessage", (data) => {
      setArrivalMessage({
        room_id: data.room,
        full_name: data.sender_name,
        sender_user_id: data.senderID,
        msg: data.msg,
        sent_at: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage && room_id===arrivalMessage.room_id
      && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);



  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await makeRequest.get(`/rooms/roomMessages/${room_id}`);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [room_id]);

  const handleSubmit = async (e) => {

    const message = {
        room_id,
        senderID: currUserdata.userID,
        msg: newMessage
    };

    socket.emit("sendRoomMessage", {
        room: room_id,
        sender_name: currUserdata.full_name,
        sender_user_id: currentUser.userID,
        msg: newMessage,
    });

  try {
    const res = await makeRequest.post("/rooms/messages", message);
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
                  <span>{roomInfo}</span>
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
                        <div className="nameMsg">
                            {!(m.sender_user_id === currentUser.userID) ?
                            <span>{m.full_name}</span> : "" }
                            <p>{m.msg}</p>
                        </div>
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
          placeholder={`Hi ${currUserdata?.full_name} type something`}
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

export default RoomChat;