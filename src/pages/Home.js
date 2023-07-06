import React, { useState, useEffect } from 'react';
import { getDoc,getDocs, collection, deleteDoc, doc, addDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../config';
import { useNavigate } from 'react-router-dom';

function Home({ isAuthAdmin, isAuthUser }) {
  const [centerList, setCenterList] = useState([]);
  const [isBooked, setisBooked] = useState(false);
  const [bookId, setBookId] = useState("");
  const [searchQuery, setsearchQuery] = useState("");
  const [filteredList, setfilteredList] = useState([]);

  const centerCollectionRef = collection(db, "centers");
  const bkdSlotsCollectionRef = collection(db, "bookedslots");
  let navigate = useNavigate();

  useEffect(() => {
    const getCentres = async () => {
      const data = await getDocs(centerCollectionRef);
      setCenterList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      getValue();
    };

    getCentres();
  }, []);

  const getValue = () => {
    const id = centerList.filter((val) => {
      if (
        (isAuthUser || isAuthAdmin) &&
        val.booked.includes(auth.currentUser.uid)
      ) {
        return val.booked;
      }
    });

    if (id.length > 0) {
      setisBooked(true);
      setBookId(id[0].id);
      localStorage.setItem("isBooked", true);
      localStorage.setItem("bookId", id[0].id);
    }

    // Count total booked slots
    const totalBookedSlots = centerList.reduce((total, center) => {
      return total + center.booked.length;
    }, 0);

    // Check if daily limit reached
    if (totalBookedSlots >= 10) {
      setisBooked(true);
      localStorage.setItem("isBooked", true);
    }
  };

  const deleteCenter = async (id) => {
    const postDoc = doc(db, "centers", id);
    await deleteDoc(postDoc);
  };

  const bookSlot = async (centerId, currentUserId) => {
    try {
      const docRef = doc(db, "centers", centerId);
      const centerDocSnap = await getDoc(docRef);
      const centerData = centerDocSnap.data();
  
      // Check if user is already booked
      if (centerData.booked.includes(currentUserId)) {
        alert("You are already booked for this center.");
        return;
      }
  
      // Fetch total booked slots
      const totalBookedSlots = centerList.reduce((total, center) => {
        return total + center.booked.length;
      }, 0);
  
      // Define the maximum booking limit per day
      const maxBookingLimitPerDay = 10;
  
      // Check if total booked slots reached the maximum limit per day
      if (totalBookedSlots >= maxBookingLimitPerDay) {
        alert("Booking limit reached for today. Please try again tomorrow.");
        return;
      }
  
      // Check if the user has already booked for the day
      const hasBookedForDay = centerData.booked.some((userId) => {
        const bookingDate = new Date(centerData.bookingDate);
        const currentDate = new Date();
        return (
          userId === currentUserId &&
          bookingDate.toDateString() === currentDate.toDateString()
        );
      });
  
      // Check if the user has reached the daily booking limit
      const userDailyBookingLimit = 3;
      const userBookedSlots = centerData.booked.filter(
        (userId) => userId === currentUserId
      ).length;
  
      if (userBookedSlots >= userDailyBookingLimit) {
        alert("You have reached the daily booking limit.");
        return;
      }
  
      // Perform the booking
      await updateDoc(docRef, {
        booked: arrayUnion(currentUserId),
      });
  
      await addDoc(bkdSlotsCollectionRef, {
        slotId: centerId,
        userId: currentUserId,
      });
  
      setisBooked(true);
      setBookId(centerId);
      localStorage.setItem("isBooked", true);
      localStorage.setItem("bookId", centerId);
    } catch (error) {
      alert(error.message);
    }
  };
  
  

  const cancel = async (uid, cid) => {
    try {
      const docRef = doc(db, "centers", cid);
      await updateDoc(docRef, {
        booked: arrayRemove(uid),
      });
      setisBooked(false);
      setBookId("");
      localStorage.setItem("isBooked", false);
      localStorage.setItem("bookId", "");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSearch = (e) => {
    setsearchQuery(e.target.value);
  };

  const filteredCenters = centerList.filter((center) => {
    const nameMatch = center.name.toLowerCase().includes(searchQuery.toLowerCase());
    const hoursMatch = center.starttime.toLowerCase().includes(searchQuery.toLowerCase()) || center.endtime.toLowerCase().includes(searchQuery.toLowerCase());
    const doseMatch = isAuthAdmin ? searchQuery.includes((center.dose - center.booked.length).toString()) : "";

    return nameMatch || hoursMatch || doseMatch;
  });

  return (
    <div className="homePage">
      <div className="searchContainer">
        <input type="text" className="search" placeholder="Search" onChange={handleSearch} />
      </div>

      <div className="centerList">
        {filteredCenters.map((center, index) => (
          <div className="center" key={center.id}>
            <p className="centerName">{index + 1}. Center Name: {center.name}</p>
            <p>Location: {center.location}</p>
            <p>Start Time: {center.starttime}</p>
            <p>End Time: {center.endtime}</p>
            <p>Type: {center.type}</p>
            <p>Dose: {center.dose - Object.keys(centerList[index].booked).length}</p>

            {isAuthUser && !isBooked && (
              <button className="bookButton" onClick={() => bookSlot(center.id, auth.currentUser.uid)}>
                Book
              </button>
            )}

            {isAuthUser && isBooked && bookId === center.id && (
              <button className="cancelButton" onClick={() => cancel(auth.currentUser.uid, center.id)}>
                Cancel
              </button>
            )}

            {isAuthAdmin && (
              <button className="deleteButton" onClick={() => deleteCenter(center.id)}>
                &#128465;
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
