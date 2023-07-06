import React from 'react'
import { auth,db } from '../config';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../App.css";
import { collection, query, where, getDocs} from 'firebase/firestore';
function Admin({setIsAuthAdmin}) {
  const [adminMail, setAdminMail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
let navigate=useNavigate()
  const login=async ()=>{
    try{ 
      const collectionRef = collection(db, 'admin'); 
      const q1= query(collectionRef,where("mail",'==',adminMail))
      const q2=query(collectionRef,where("password",'==',adminPassword))

      const qs1=await getDocs(q1)
      const d1=qs1.docs

      const qs2=await getDocs(q2)
      const d2=qs2.docs


      if(d1.length>0&&d2.length>0){
        setIsAuthAdmin(true) 
        localStorage.setItem("isAuthAdmin",true)
        navigate('/AddCenter')
      }
      else{
        alert("Enter valid admin mail and password")
      }
    }
    catch(error){
        console.log(error.message);
    }
  }
  return (
    <div style={{ textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
  <h3 style={{ fontSize: '24px', marginBottom: '20px', color: '#333' }}>Admin Login</h3>
  <div style={{ marginBottom: '20px' }}>
    <label htmlFor="email" style={{ fontSize: '16px', marginBottom: '10px', color: '#555' }}>Email</label>
    <input type="email" id="email" placeholder="Enter your email" style={{ padding: '12px', border: '2px solid #ccc', borderRadius: '4px', fontSize: '16px', width: '100%' }} onChange={(e) => setAdminMail(e.target.value)} />
  </div>
  <div style={{ marginBottom: '20px' }}>
    <label htmlFor="password" style={{ fontSize: '16px', marginBottom: '10px', color: '#555' }}>Password</label>
    <input type="password" id="password" placeholder="Enter your password" style={{ padding: '12px', border: '2px solid #ccc', borderRadius: '4px', fontSize: '16px', width: '100%' }} onChange={(e) => setAdminPassword(e.target.value)} />
  </div>
  <button onClick={login} style={{ padding: '12px 24px', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.3s ease' }}>Login</button>
</div>

  )
}

export default Admin