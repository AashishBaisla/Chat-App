import "./Rooms.css"
import React from 'react'
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import { makeRequest } from "../../../axios";
import socket from "../../../io";
import moment from "moment";

const Rooms = () => {

    const { currentUser } = useContext(AuthContext);
    const [roomsList, setRoomsList] = useState([]);
    const [roomsJoined, setRoomsJoined] = useState([]);
    const [roomsListRefresh, setRoomsListRefresh] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [joinFirst, setJoinFirst] = useState(false);

    const [roomName, setRoomName] = useState("")
  
    const navigate = useNavigate();
  
    useEffect(() => {
      socket?.emit("addUser", currentUser.userID);
      socket.on("getUsers", (users) => { 
        setOnlineUsers(users=users.filter((user) => user.userID !== currentUser.userID)) 
      });
    }, [currentUser]);
  
  
    useEffect(() => {
      const getRoomsList = async () => {
        try {
          makeRequest.get(`/rooms/roomsList`).then((res) => {
            setRoomsList(res.data);
          })
        } catch (err) {
          console.log(err);
        }
      }
      const getRoomsJoined = async () => {
          try {
              makeRequest.get(`/rooms/roomsJoined/${currentUser.userID}`).then((res) => {
                  setRoomsJoined(res.data);
                  console.log(roomsJoined);
                })
            } catch (err) {
                console.log(err);
            }
        }
        getRoomsList();
        getRoomsJoined();
    }, [roomsListRefresh]);
  
    const handleBack = (e) => {
      e.preventDefault();
      navigate(-1);
    }
  
    const handleEnterRoom = (room_id) => {
      navigate(`/rooms/${room_id}`) ;
    }
  
    const deleteRoom = async (room_id) => {
      try {
        await makeRequest.delete(`/rooms/${room_id}`);
        console.log("Successfully Delete");
        setRoomsListRefresh(!roomsListRefresh)
      } catch (err) {
        console.log(err);
      }
    };

    const handleCreateRoom = async(name) => {
        setShowCreate(!showCreate)
      try {
        await makeRequest.post("/rooms", {roomname: name});
        setRoomsListRefresh(!roomsListRefresh)
      } catch (err) {
        console.log(err);
      }
    }

    const handleJoinRoom = async(room_id) => {
      try {
        await makeRequest.post("/rooms/joinroom", {room_id: room_id, user_id: currentUser.userID});
        setRoomsListRefresh(!roomsListRefresh)
      } catch (err) {
        console.log(err);
      }
    }

    const handleLeaveRoom = async(room_id) => {
      try {
        await makeRequest.post("/rooms/leaveroom", {room_id: room_id, user_id: currentUser.userID});
        setRoomsListRefresh(!roomsListRefresh)
      } catch (err) {
        console.log(err);
      }
    }
    const [roomMatch, setRoomMatch] = useState() 
    const handleEntrance = (card, room_id) => {
        if (card) { 
            handleEnterRoom(room_id);
        } else {
            setRoomMatch(room_id);
            setJoinFirst(true);
        }
    }
    

  return (
    <div className="roomCard">
        <header>
          <img className="backIcon" src="/icons/back-b.png" onClick={handleBack}/>
          <h5>Rooms</h5>
        </header>

        <div className="container">

          <div className="createRoom">
          {!showCreate && 
            <div className="button">
                <button onClick={() => { setShowCreate(!showCreate) }}>
                    Create New Room
                </button>   
            </div>
            }

            {showCreate && 
            <div className="createRoomInput">
                <img src='/icons/group.png' alt='user-icon'/>
                <input
                    type="text"
                    placeholder="Enter room name"
                    name="roomname"
                    required
                    onChange={(e) => {setRoomName(e.target.value)}}
                />
                <button style={!roomName ? {backgroundColor: "gray"} : {backgroundColor: "green"}}
                    onClick={() => handleCreateRoom(roomName)}
                    disabled={!roomName ? true : false}>
                        Create
                </button>
            </div>}
          </div>

          <div className="group">
          {(Object.keys(roomsList)).length !== 0 ? roomsList?.map((r) => (
            <div key={r.room_id}>
                  <div className="left" 
                    onClick={() => {handleEntrance((roomsJoined.map(item=>(item.room_id))).includes(r.room_id), r.room_id)}}>
                    <img className="userImg" 
                      src="/icons/team.png" alt="user-Image"/>
                    <div className="nameMsg">
                      <p>{r?.room_name}</p>
                    </div>
                  </div>


                    <div className="right"> 
                    { joinFirst && r.room_id===roomMatch &&
                    <div className="joinFirst">Join First</div>
                    }
                    {(roomsJoined.map(item=>(item.room_id))).includes(r.room_id) ?
                        <button className="leaveButton" onClick={() => handleLeaveRoom(r.room_id)}>Leave</button>
                    :
                        <button className="joinButton" onClick={() => handleJoinRoom(r.room_id)}>Join</button> 
                    }
                      <img src="/icons/delete.png" alt="deleteIcon" onClick={() => deleteRoom(r.room_id)}/>
                    </div>
                </div>))
            : <div className="noConversation">
                No Rooms
              </div>}
          </div>
        </div>
    </div>
  )
}

export default Rooms