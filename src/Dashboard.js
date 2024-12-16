import { signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db } from "./firebase-config";

const Dashboard = () => {
  const [entries, setEntries] = useState([]); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const entriesCollection = collection(db, "travel-journalcd"); 
        const entriesSnapshot = await getDocs(entriesCollection);
        const entriesList = entriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })); 
        setEntries(entriesList); 
      } catch (error) {
        console.error("Error fetching entries: ", error);
        alert("Error fetching entries. Please try again later.");
      }
    };

    fetchEntries();
  }, []); 

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      alert("Logged out successfully!");
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out: ", error);
      alert("Error logging out. Please try again.");
    }
  };

  return (
    <div className="dashboard">
      <h2>Your Travel Journal</h2>

      
      <button onClick={() => navigate("/create-entry")} className="btn">
        Add New Entry
      </button>

     
      <button onClick={handleLogout} className="btn">
        Logout
      </button>

      
      {entries.length > 0 ? (
        <div className="entries-list">
          {entries.map((entry) => (
            <div className="entry" key={entry.id}>
              <h3>{entry.title}</h3>
              <p>{entry.description}</p>
              {entry.imageURL ? (
                <img
                  src={entry.imageURL}
                  alt={entry.title}
                  className="entry-image"
                />
              ) : (
                <p>No image available</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No entries yet. Add a new entry!</p>
      )}
    </div>
  );
};

export default Dashboard;
