import { signOut } from "firebase/auth";
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardMap from '../components/DashboardMap';
import MenuBar from "../components/MenuBar";
import { auth, db } from '../firebase-config';
import './Dashboard.css';

const imageMapping = {
  '0NGzyBB0W9XYowo8Iljq': '/japan.jpg',    
  'BnXU9zjjXBuz8ERQ8qME': '/madeira.jpg', 
  'EQZyHJZpyyHB7sybdeem': '/lefkada.jpeg', 
  'I2wfkaI2i4UbIpivDQbc': '/bucale.jpeg', 
  'leUo11JRQdNs90b6qoic': '/london.jpg', 
  'mfk8GLoNqa4EPRf0JnAR': '/rome.jpg',
  'zM77As6lHhtV11gDV9eK': '/nyc.jpg',
};

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch entries from Firestore
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const entriesCollection = collection(db, 'travel-journalcd');
        const entriesSnapshot = await getDocs(entriesCollection);
        const entriesList = entriesSnapshot.docs.map(doc => ({
          id: doc.id, 
          ...doc.data(),
        }));
        setEntries(entriesList);
        setFilteredEntries(entriesList); // Initially display all entries
      } catch (error) {
        console.error("Error fetching entries: ", error);
        alert("Error fetching entries. Please try again later.");
      }
    };

    fetchEntries();
  }, []);

  // Handle search input change and filter entries by tag
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = entries.filter((entry) =>
      entry.tags?.some((tag) => tag.toLowerCase().includes(term))
    );
    setFilteredEntries(filtered.length > 0 ? filtered : []);  // Show filtered entries
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out: ", error);
      alert("Error logging out. Please try again.");
    }
  };

  return (
    <div className="dashboard-container">
      <MenuBar onSearch={handleSearch} />  {/* Pass handleSearch as prop to MenuBar */}
      <div className="dashboard-content">
        <h2 className="dashboard-title">Your Travel Journal</h2>
        <DashboardMap entries={filteredEntries} />

        {filteredEntries.length > 0 ? (
          <div className="entries-grid">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="entry-card"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/entry/${entry.id}`)}  // Redirect to EntryDetail on click
              >
                <h3>{entry.title}</h3>
                {imageMapping[entry.id] ? (
                  <img
                    src={imageMapping[entry.id]}
                    alt={entry.title}
                    className="entry-image"
                  />
                ) : (
                  <p>No image available</p>
                )}
                <p>Tags: {Array.isArray(entry.tags) ? entry.tags.join(', ') : 'No tags'}</p>
                <p>Rating: {entry.rating}</p>
                <p>{entry.favorite ? '❤️ Favorite' : '💔 Not Favorite'}</p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();  // Prevent the entry click event from triggering
                    navigate(`/edit/${entry.id}`);  // Redirect to edit page
                  }}
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No entries found. Add a new entry or try a different search!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
