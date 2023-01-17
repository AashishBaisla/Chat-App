import React, {useContext, useState } from 'react' ;
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import "./Login.css" ;


const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [status, setStatus] = useState("") ;

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogIn = async (e) => {
    try {
      await login(inputs);
      navigate("/");
    }
    catch (err) {
      console.log(err.response.data);
      setStatus(err.response.data)
    }
  };

  return (
    <div className='loginBody'>
      <div className="logInContainer">
        <header>CHAT APP</header>
        <div className="validationText"
          style={{backgroundColor: status?"#ffffffb7":"transparent"}}>
            {status}
        </div>

        <div className='input'>
          <img src='/icons/user-b.png' alt='user-icon'/>
          <input
            type="text"
            placeholder="Username"
            name="username"
            required
            onChange={handleChange}
            onFocus={() => {setStatus(false)}}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleLogIn();
              }
            }}
          />
        </div>

        <div className='input'>
          <img src='/icons/lock.png' alt='lock-icon'/>
          <input
            type="password"
            placeholder="Password"
            name="password"
            required
            id="password"
            onChange={handleChange}
            onFocus={() => {setStatus(false)}}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleLogIn();
              }
            }}
          />
        </div>

        <div className='buttons'>
          <button id="LogIn" onClick={handleLogIn}>Log In</button>
          <div id='signUp'>
            Don't have an account ? 
            <Link id='clicksignUp'  to="/register"> Sign up</Link>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Login;
