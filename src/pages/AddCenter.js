import React from 'react'
import { useState ,useEffect} from 'react'
import { addDoc,collection, getDocs } from 'firebase/firestore';
import { db } from '../config';
import { useNavigate } from 'react-router-dom';


function AddCenter({isAuthAdmin}) {
 const [name, setName] = useState();
 const [location, setLocation] = useState();
 const [type, setType] = useState();
 const [startTime, setStartTime] = useState();
 const [endTime, setEndTime] = useState();
 const [dose, setDose] = useState(0);
 const centerCollectionRef=collection(db,"centers")  ;
 let navigate=useNavigate()
 const add=async()=>{
    const centersSnapshot = await getDocs(centerCollectionRef);
  const centers = centersSnapshot.docs.map((doc) => doc.data());

  const totalBookings = centers.reduce((total, center) => {
    return total + center.booked.length;
  }, 0);

  if (totalBookings >= 10) {
    alert("Daily booking limit reached. Please try again tomorrow.");
    return;
  }

   await addDoc(centerCollectionRef,
    {
        name:name||null,
        location:location||null,
        starttime:startTime||null,
        endtime:endTime||null,
        type:type||null,
        dose:Number(dose)||null,
        booked:new Array()
    })
    .then(()=>{
        navigate('/')
    })
 }
  useEffect(()=>{
   if(!isAuthAdmin)
   navigate('/Admin')
  },[])
  return ( 
    <div style={{ textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor="centerName" style={{ fontSize: '16px', marginBottom: '10px', color: '#555' }}>Center Name</label>
      <input type="text" id="centerName" placeholder="Enter center name" style={{ padding: '12px', border: '2px solid #ccc', borderRadius: '4px', fontSize: '16px', width: '100%' }} onChange={(e) => setName(e.target.value)} />
    </div>
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor="location" style={{ fontSize: '16px', marginBottom: '10px', color: '#555' }}>Location</label>
      <input type="text" id="location" placeholder="Enter location" style={{ padding: '12px', border: '2px solid #ccc', borderRadius: '4px', fontSize: '16px', width: '100%' }} onChange={(e) => setLocation(e.target.value)} />
    </div>
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor="openingTime" style={{ fontSize: '16px', marginBottom: '10px', color: '#555' }}>Opening Time</label>
      <input type="time" id="openingTime" style={{ padding: '12px', border: '2px solid #ccc', borderRadius: '4px', fontSize: '16px', width: '100%' }} onChange={(e) => setStartTime(e.target.value)} />
    </div>
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor="closingTime" style={{ fontSize: '16px', marginBottom: '10px', color: '#555' }}>Closing Time</label>
      <input type="time" id="closingTime" style={{ padding: '12px', border: '2px solid #ccc', borderRadius: '4px', fontSize: '16px', width: '100%' }} onChange={(e) => setEndTime(e.target.value)} />
    </div>
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor="vaccineType" style={{ fontSize: '16px', marginBottom: '10px', color: '#555' }}>Vaccine Type</label>
      <select id="vaccineType" style={{ padding: '12px', border: '2px solid #ccc', borderRadius: '4px', fontSize: '16px', width: '100%' }} onChange={(e) => setType(e.target.value)}>
        <option value="Covishield">Covishield</option>
        <option value="Covaxine">Covaxine</option>
      </select>
    </div>
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor="dosage" style={{ fontSize: '16px', marginBottom: '10px', color: '#555' }}>Dosage</label>
      <input type="number" id="dosage" min="1" max="3" placeholder="Enter dosage" style={{ padding: '12px', border: '2px solid #ccc', borderRadius: '4px', fontSize: '16px', width: '100%' }} onChange={(e) => setDose(e.target.value)} />
    </div>
    <button onClick={add} style={{ padding: '12px 24px', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.3s ease' }}>Add</button>
  </div>
  
  )
}

export default AddCenter