import React, { useEffect, useState } from 'react' ;
import { Link } from 'react-router-dom';
import { makeRequest } from '../../axios';
import "./Signup.css" ;

const Signup = () => {
  const [inputs, setInputs] = useState({
    fullname: "",
    username: "",
    password: "",
    cpassword: ""
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault() ;
    try {
      const response = await makeRequest.post("/auth/register", inputs);
      console.log(response)
      showAlert(response.data.type, response.data.message);
    }
    catch (err) {
      console.log(err)
      showAlert("warning", err.response.data.message);
    }
  };

/*-----------------SET VALIDATION TEXT-----------------------*/
  const [status, setStatus] = useState("") ;
  const [statusColor, setstatusColor] = useState({
    color: "",
    backColor: ""
  });

  const showAlert = (type, message) => {
    if (type==="success") {
      setstatusColor({color:"#270", backColor: "#DFF2BF"})
    }
    if (type==="fail") {
      setstatusColor({color:"#D8000C", backColor: "#FFBABA"})
    }
    if (type==="warning") {
      setstatusColor({color:"#9F6000", backColor: "#FEEFB3"})
    }
    if (type==="") {
      setstatusColor({color:"transparent", backColor: "transparent"})
    }
    setStatus({
      type: type,
      message: message
    })
  }


  useEffect(() => {
    inputs.username && (!/^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/i.test(inputs.username))?
    showAlert("warning", "Invalid Username"):showAlert("", "");
  }, [inputs.username]);


  useEffect(() => {
    if (inputs.password && inputs.cpassword && (inputs.password !== inputs.cpassword)){
        return showAlert("warning", "Password doesn't match");
    }
    else {
        showAlert("", "");
    }
  }, [inputs.password, inputs.cpassword]);

  
  return (
    <div className='signupBody'>
      <div className="signUpContainer">
        <header>CHAT APP</header>
        <div className="validationText"
          style={{color: statusColor.color, backgroundColor: statusColor.backColor}}>
            {status.message}
        </div>

        <div>
          <img src='/icons/user-b.png' alt='name-icon'/>
          <input type="text" name='fullname' placeholder="Full Name" required
            onChange={handleChange}/>
        </div>
      
        <div>
          <img src='/icons/id-badge.png' alt='name-icon'/>
          <input type="text" name='username' placeholder="Username" required
            onChange={handleChange}/>
        </div>
      
        <div>
          <img src='/icons/lock.png' alt='name-icon'/>
          <input type="password" name='password' placeholder="Password" required
            onChange={handleChange}/>
        </div>
      
        <div>
          <img src='/icons/lock.png' alt='name-icon'/>
          <input type="password" name='cpassword' placeholder="Confirm Password" required
            onChange={handleChange}/>
        </div>
      
        <button id='SignUp' onClick={handleSignUp}>Sign Up</button>
      
        <div className='haveAccount'>
          Already have an account?
          <Link id='clickHere'  to="/login"> Click Here</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup ;