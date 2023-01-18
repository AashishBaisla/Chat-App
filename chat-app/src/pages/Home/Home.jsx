import "./Home.css"
import { Routes, Route, useNavigate } from "react-router-dom" ;
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import Users from "./Users/Users";
import NavigationCard from './NavigationCard/NavigationCard' ;
import Messages from "./Messages/Messages";
import ChatBox from "./Chatbox/ChatBox";
import Rooms from "./Rooms/Rooms";
import RoomChat from "./Rooms/RoomChat/RoomChat";

function Home() {

  const {currentUser} = useContext(AuthContext);

  const navigate = useNavigate();
  useEffect(()=> {
    if(!currentUser) {
      navigate("login");
    }
  });

  return (
    <>
      <main className="homeBody">

        <div className='LeftSide'>
          <NavigationCard/>
        </div>

        <div className='middleSide'>
          <Routes>
              <Route exact path="/" element={<Users/>}/>
              <Route exact path="messages" element={<Messages />} />
                <Route exact path="messages/:convID/:receiverID" element={<ChatBox/>} />

                <Route exact path="rooms" element={<Rooms />} />
                  <Route exact path="rooms/:room_id" element={<RoomChat />} />
          </Routes>
        </div>

      </main>
    </>
  )
}

export default Home;
