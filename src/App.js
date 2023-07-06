import { useState } from "react";
import {BrowserRouter as Router,Routes,Route,Link} from "react-router-dom"
import User from "./pages/User";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AddCenter from "./pages/AddCenter";
import {signOut} from "firebase/auth";
import { auth } from './config';
import "./App.css";


function App() {
  const [isAuthAdmin, setIsAuthAdmin] = useState(localStorage.getItem("isAuthAdmin"));  
  const [isAuthUser, setIsAuthUser] = useState(localStorage.getItem("isAuthUser"));
  
  const signoutAdmin=async()=>{
   await signOut(auth)
   .then(()=>{
    setIsAuthAdmin(false)
    localStorage.clear()
    window.location.pathname="/"
   })
 
  }
  const signoutUser=async()=>{
    await signOut(auth)
    .then(()=>{
      setIsAuthUser(false)
     localStorage.clear()
     window.location.pathname="/"
    })
  
   }
  return (
    <div className="App">
      <Router>
        <nav>
         <h4 className="heading">VaxScheduler</h4>
        <Link to="/">Home</Link>
         {
            isAuthAdmin&& <Link to="/AddCenter" >Addcenters</Link>
         }
        {
          !isAuthUser?
            !isAuthAdmin&&<Link to="/User">User</Link>
          :
          <button onClick={signoutUser}>SignOut</button>  
          }
           {
          !isAuthAdmin?
          !isAuthUser&&<Link to="/Admin">Admin</Link>:
        <button onClick={signoutAdmin}>SignOut</button>  
          }
         
        </nav>
        <Routes>
          <Route path='/' element={<Home isAuthAdmin={isAuthAdmin} isAuthUser={isAuthUser}/>}/>
          <Route path='/User' element={<User setIsAuthUser={setIsAuthUser}/>}/>
          <Route path='/Admin' element={<Admin setIsAuthAdmin={setIsAuthAdmin} />}/>
          <Route path='/AddCenter' element={<AddCenter isAuthAdmin={isAuthAdmin}/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;