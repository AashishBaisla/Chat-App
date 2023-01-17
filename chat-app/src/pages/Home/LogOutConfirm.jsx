import "./LogOutConfirm.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { PopupContext } from "../../context/PopupContext";
import { makeRequest } from "../../axios";

const LogOutConfirm = () => {
    /*const { LogOut, setLogOut } = useContext(PopupContext) ;*/

    const navigate = useNavigate();

    const handleLogOut = async (e) => {
      e.preventDefault();
        try {
          localStorage.clear()
          await makeRequest.post("/auth/logout",{},{
            withCredentials: true
          });
          navigate("login");
        }catch (err) {
          console.log(err);
        }
    };
/*            <button onClick={() => setLogOut(false)} className="no">NO</button>*/
  return false ? ( 
    <div className="logOutPopup">
      <div className="logOutCard">
        <div className="content">
          <h4>Confirmation!</h4>
          <p>Are you sure you want to log out ?</p>
          <div className="buttons">
            <button onClick={handleLogOut} className="yes">YES</button>

          </div>
        </div>
      </div>
    </div> ) : "" ;
}

export default LogOutConfirm ;