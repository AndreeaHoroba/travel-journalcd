import { signOut } from "firebase/auth";
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import DashboardMap from './DashboardMap'; // Import the map component
import { auth, db } from './firebase-config';

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const entriesCollection = collection(db, 'travel-journalcd');
        const entriesSnapshot = await getDocs(entriesCollection);
        const entriesList = entriesSnapshot.docs.map(doc => ({
          id: doc.id, // Store the document ID
          ...doc.data(),
        }));
        setEntries(entriesList);
        setFilteredEntries(entriesList); // Initialize filtered entries
      } catch (error) {
        console.error("Error fetching entries: ", error);
        alert("Error fetching entries. Please try again later.");
      }
    };

    fetchEntries();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = entries.filter((entry) =>
      entry.tags?.some((tag) => tag.toLowerCase().includes(term))
    );
    setFilteredEntries(filtered.length > 0 ? filtered : []);
  };

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
      {/* Menu Bar */}
      <div className="menu-bar">
        <div className="menu-item" onClick={() => navigate('/create-entry')}>
          Add New Entry
        </div>
        <div className="menu-item" onClick={handleLogout}>
          Logout
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by tag"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <h2>Your Travel Journal</h2>
        <DashboardMap entries={filteredEntries} />

        {filteredEntries.length > 0 ? (
          <div className="entries-grid">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="entry-card"
                onClick={() => navigate(`/entry/${entry.id}`)} // Navigate to EntryDetail with ID
                style={{ cursor: 'pointer' }}
              >
                <h3>{entry.title}</h3>
                {entry.imageURL && (
                  <img
                    src={entry.imageURL}
                    alt="entry"
                    className="entry-image"
                  />
                )}
                <p>Tags: {Array.isArray(entry.tags) ? entry.tags.join(', ') : 'No tags'}</p>
                <p>Rating: {entry.rating}</p>
                <p>{entry.favorite ? '❤️ Favorite' : '💔 Not Favorite'}</p>
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
