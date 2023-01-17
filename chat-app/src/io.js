import { io } from "socket.io-client";
const CON_PORT = "localhost:5000" ;

let socket ;
var connectionOptions =  {
    "force new connection" : true,
    "reconnectionAttempts": "Infinity", 
    "timeout" : 10000,                  
    "transports" : ["websocket"]
  };
  export default socket = io(CON_PORT,connectionOptions);