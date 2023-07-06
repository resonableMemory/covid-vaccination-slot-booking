import React, { useState } from 'react';
import { auth } from '../config';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword,signInWithEmailAndPassword} from 'firebase/auth';
function User({setIsAuthUser}) {
  const [isRegisterVisible, setIsRegisterVisible] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  let navigate=useNavigate();
  
  const handleRegister = () => {
    setIsRegisterVisible(true);
    setIsLoginVisible(false);
    setEmail("")
    setPassword("")
  };

  const handleLogin = () => {
    setIsRegisterVisible(false);
    setIsLoginVisible(true);
    setEmail("")
    setPassword("")
  };

  const handleRegisterSubmit =async( e) => {
    e.preventDefault();
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
       email,
       password
      )
      .then(()=>{
        setIsAuthUser(true) 
        localStorage.setItem("isAuthUser",true)
        navigate('/')
      })
    } catch (error) {
      alert(error.message)
      console.log(error.message);
    }
  };

  const handleLoginSubmit = async(e) => {
    e.preventDefault();
    try {
      const user = await signInWithEmailAndPassword(
        auth,
       email,
       password
      )
      .then(()=>{
        setIsAuthUser(true) 
        localStorage.setItem("isAuthUser",true)
        navigate('/')
      })
    } catch (error) {
      alert(error.message)
      console.log(error.message);
    }
  };

  return (
    <div style={{ textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
    <h2>User Authentication</h2>
    <div>
      <button onClick={handleRegister} style={{ padding: '12px 24px', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.3s ease', marginRight: '10px' }}>Register</button>
      <button onClick={handleLogin} style={{ padding: '12px 24px', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.3s ease' }}>Login</button>
    </div>
    {isRegisterVisible && (
      <form onSubmit={handleRegisterSubmit} style={{ marginTop: '20px' }}>
        <h3>Register</h3>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '12px', border: '2px solid #ccc', borderRadius: '4px', fontSize: '16px', width: '100%' }} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '12px', border: '2px solid #ccc', borderRadius: '4px', fontSize: '16px', width: '100%' }} />
        </div>
        <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.3s ease', marginTop: '10px' }}>Register</button>
      </form>
    )}
    {isLoginVisible && (
      <form onSubmit={handleLoginSubmit} style={{ marginTop: '20px' }}>
        <h3>Login</h3>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '12px', border: '2px solid #ccc', borderRadius: '4px', fontSize: '16px', width: '100%' }} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '12px', border: '2px solid #ccc', borderRadius: '4px', fontSize: '16px', width: '100%' }} />
        </div>
        <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.3s ease', marginTop: '10px' }}>Login</button>
      </form>
    )}
  </div>
  
  );
}

export default User;
