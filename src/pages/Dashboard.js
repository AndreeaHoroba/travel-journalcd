import { signOut } from "firebase/auth";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardMap from '../components/DashboardMap';
import MenuBar from "../components/MenuBar";
import { auth } from '../firebase-config';
import './Dashboard.css';

const imageMapping = {
  '0NGzyBB0W9XYowo8Iljq': '/japan.jpg',
  'BnXU9zjjXBuz8ERQ8qME': '/madeira.jpg',
  'EQZyHJZpyyHB7sybdeem': '/lefkada.jpeg',
  'I2wfkaI2i4UbIpivDQbc': '/bucale.jpeg',
  'leUo11JRQdNs90b6qoic': '/london.jpg',
  'mfk8GLoNqa4EPRf0JnAR': '/rome.jpg',
  'zM77As6lHhtV11gDV9eK': '/nyc.jpg',
  'af8izeE7kr46Ew78x2pK': '/hawaii.jpg'
};

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/entries');
      const data = await response.json();
      setEntries(data);
      setFilteredEntries(data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/entries/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete entry');

      setEntries((prev) => prev.filter((entry) => entry.id !== id));
      setFilteredEntries((prev) => prev.filter((entry) => entry.id !== id));

      alert("Entry deleted successfully!");
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Failed to delete entry.");
    }
  };

  const handleSearch = (term) => {
    const lowerCaseTerm = term.toLowerCase();
    const filtered = entries.filter(entry =>
      entry.tags?.toLowerCase().includes(lowerCaseTerm)
    );
    setFilteredEntries(filtered);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Error logging out. Please try again.");
    }
  };

  return (
    <div className="dashboard-container">
      <MenuBar onSearch={handleSearch} />
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
                onClick={() => navigate(`/entry/${entry.id}`)}
              >
                <h3>{entry.title}</h3>
                <img
                  src={imageMapping[entry.id] || entry.imageUrl || '/default.jpg'}
                  alt={entry.title}
                  className="entry-image"
                />
                <p>Tags: {entry.tags || 'No tags'}</p>
                <p>Rating: {entry.rating}</p>
                <p>{entry.favorite ? '❤️ Favorite' : '💔 Not Favorite'}</p>

                <div className="entry-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit/${entry.id}`);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(entry.id);
                    }}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
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
