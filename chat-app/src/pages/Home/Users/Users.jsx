import './Users.css';
import { useContext, useEffect } from 'react';
import { makeRequest } from "../../../axios";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthContext } from '../../../context/authContext';

const Users = () => {
  const [data, setData] = useState([])
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const getSuggestions = async () => {
      try {
        await makeRequest.post("/users/suggestions/" + currentUser.userID).then((res) => {
          setData(Array.from(res.data));
        })
      } catch (err) {
        console.log(err);
      }
    };
    getSuggestions();
  }, []);

  const navigate = useNavigate();
  const handleBack = (e) => {
    e.preventDefault();
    navigate(-1);
  }

  const handleMessage = (id) => {
    const ids = {
    user_id_1 : currentUser.userID,
    user_id_2 : id
    }
    try {
      makeRequest.post("/conversations", ids).then((res) => {
        const conversation_id = res.data ;
        navigate(`/messages/${conversation_id}/${ids.user_id_2}`);
      });
    } catch (err) {
      console.log(err);
    }
  }
      
  return (
    <div className='suggestionCard'>
      <header>
        <img src="/icons/back-b.png" onClick={handleBack} alt="back-icon"/>
        <h5>Users</h5>
      </header>
      <div className='container'>
      <div className="group">
        {!data
          ? "Loading.."
          : data.map((useR) =>
              <div key={useR.userID} className="user" onClick={() => handleMessage(useR.userID)}>
                  <div className="userInfo">
                    <img src="/icons/default.jpg" className="profilepic" alt=""/>
                    <div className="details">
                      <span className="userName">{useR.full_name}</span>
                      <span className="userhandle">{useR.username}</span>
                    </div>
                  </div>
          </div>)}
      </div>
      </div>

    </div>
  );
};

export default Users ;