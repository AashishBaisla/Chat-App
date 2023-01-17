import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./pages/ProtectedRoute";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import Home from "./pages/Home/Home";

function App() {

  return (
    <div>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Signup />} />
        <Route exact path="*" element={<ProtectedRoute Component={Home}/>} />
      </Routes>
    </div>
  );
}

export default App;
