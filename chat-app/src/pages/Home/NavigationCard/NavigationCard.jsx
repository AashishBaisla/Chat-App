import "./NavigationCard.css"
import { Outlet } from "react-router-dom"
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/authContext";
import { makeRequest } from "../../../axios";

function NavigationCard() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [data, setData] = useState()
  const { currentUser} = useContext(AuthContext)

  useEffect(() => {
    const getData = async () => {
      try {
        await makeRequest.get(`/users/userID/${currentUser.userID}`).then((res) => {
          setData(res.data);
        })
      } catch (err) {
        console.log(err);
      }
    }
    getData();
  }, []);

  const handleLogOut = async (e) => {
    e.preventDefault();
      localStorage.clear()
      navigate("/login");
  };


  const navigate = useNavigate();
  const handleClick = (index) => {
    setActiveIndex(index);
    if (index === 0)  return navigate("/");
    if (index === 1)  return navigate("/messages");
    if (index === 2)  return navigate("/rooms");
  };
  
  return (
    <div className="navigationCard">

      <div className="helloCard">
        <img src="/icons/default.jpg" alt="DP"/>
        <p className="fullName">{data?.full_name}
        <br/>
          <span>{data?.username}</span>
        </p>
      </div>

      <div className="mainNavigation" >

          <div className={activeIndex === 0 ? "active" : ""}
               onClick={() => handleClick(0)}>
              <img src="/icons/user-blue.png"/>
              <p>Users</p>
          </div>

          <div className={activeIndex === 1 ? "active" : ""}
               onClick={() => handleClick(1)}>
              <img src="/icons/message-blue.png"/>
              <p>Messages</p>
          </div>

          <div className={activeIndex === 2 ? "active" : ""}
               onClick={() => handleClick(2)}>
              <img src="/icons/group.png"/>
              <p>Rooms</p>
          </div>

          <div className="logOut" onClick={handleLogOut}>
            <img src="/icons/logout-red.png"/>
            <p>Log Out</p>
          </div>
      </div>

      <div className="bottomNav">

        <div className="logOut" onClick={handleLogOut}>
            <img src="/icons/logout-red.png"/>
            <p>Log Out</p>
        </div>
      </div>

      <Outlet />
    </div>
  );
}
 
export default NavigationCard;