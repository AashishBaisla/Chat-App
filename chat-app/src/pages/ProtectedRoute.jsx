import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/authContext";

const ProtectedRoute = (props) => {
  const {Component} = props ;
  const {currentUser} = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(()=> {
    if(!currentUser) {
      navigate("login");
    }
  });
    
  if(currentUser) {
      return <Component/> ;
    }
}

export default ProtectedRoute