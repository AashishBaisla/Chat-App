import "./Home.css"
import { Routes, Route, useNavigate } from "react-router-dom" ;
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import Users from "./Users/Users";
import NavigationCard from './NavigationCard/NavigationCard' ;
import Messages from "./Messages/Messages";
import ChatBox from "./Chatbox/ChatBox";
import LogOutConfirm from "./LogOutConfirm";

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
            <LogOutConfirm/>
          <Routes>
              <Route exact path="/" element={<Users/>}/>
              <Route exact path="messages" element={<Messages />} />
                <Route exact path="messages/:convID/:receiverID" element={<ChatBox/>} />
          </Routes>
        </div>

      </main>
    </>
  )
}

export default Home;
