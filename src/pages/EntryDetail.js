import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EntryDetail.css';

const EntryDetail = () => {
  const { entryId } = useParams();
  const [entry, setEntry] = useState(null);
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({
    name: '',
    category: '',
    description: '',
  });
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch entry + activities from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const entryRes = await fetch(`http://localhost:8080/api/entries/${entryId}`);
        if (!entryRes.ok) throw new Error('Failed to fetch entry');
        const entryData = await entryRes.json();
        setEntry(entryData);

        const actRes = await fetch(`http://localhost:8080/api/activities/entry/${entryId}`);
        if (actRes.ok) {
          const actData = await actRes.json();
          setActivities(actData);
        }
      } catch (error) {
        console.error('❌ Error fetching data:', error);
      }
    };

    fetchData();
  }, [entryId]);

  // ✅ Add new activity (save in backend)
  const handleAddActivity = async () => {
    if (!newActivity.name.trim()) return alert('Please enter a name!');
    try {
      const response = await fetch('http://localhost:8080/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newActivity.name,
          category: newActivity.category,
          description: newActivity.description,
          entry: { id: entry.id }, // link activity to entry
        }),
      });

      if (!response.ok) throw new Error('Failed to save activity');
      const saved = await response.json();
      setActivities([...activities, saved]);
      setNewActivity({ name: '', category: '', description: '' });
      setShowForm(false);
    } catch (error) {
      console.error('❌ Error saving activity:', error);
    }
  };

  // ✅ Delete activity
  const handleDeleteActivity = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/activities/${id}`, { method: 'DELETE' });
      setActivities(activities.filter((a) => a.id !== id));
    } catch (error) {
      console.error('❌ Error deleting activity:', error);
    }
  };

  if (!entry) return <div className="loading">Loading...</div>;

  const getImageSrc = (url) => {
    if (!url) return '/default.jpg';
    if (url.startsWith('data:image')) return url;
    if (url.startsWith('http')) return url;
    return `http://localhost:8080${url}`;
  };

  return (
    <div className="entry-detail-container">
      {/* 🔙 Back button */}
      <button className="back-button" onClick={() => navigate('/dashboard')}>
        ←
      </button>

      <div className="entry-detail-card">
        <h1 className="entry-title">{entry.title}</h1>

        {entry.imageUrl ? (
          <img src={getImageSrc(entry.imageUrl)} alt={entry.title} className="entry-image" />
        ) : (
          <div className="no-image">No image available</div>
        )}

        <p className="entry-description">{entry.description}</p>

        <div className="entry-info">
          <p><strong>Tags:</strong> {entry.tags || 'No tags'}</p>
          <p><strong>Rating:</strong> {entry.rating || 'N/A'}</p>
          <p><strong>Favorite:</strong> {entry.favorite ? '❤️ Yes' : '💔 No'}</p>
        </div>

        {/* 🏖️ Activities Section */}
        <div className="activities-section">
          <h2>Activities</h2>
          <button className="add-activity-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Activity'}
          </button>

          {showForm && (
            <div className="activity-form">
              <input
                type="text"
                placeholder="Activity name"
                value={newActivity.name}
                onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Category"
                value={newActivity.category}
                onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}
              />
              <textarea
                placeholder="Description"
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
              />
              <button onClick={handleAddActivity}>Save Activity</button>
            </div>
          )}

          <ul className="activity-list">
            {activities.length === 0 ? (
              <p>No activities yet.</p>
            ) : (
              activities.map((a) => (
                <li key={a.id} className="activity-item">
                  <div>
                    <strong>{a.name}</strong> ({a.category})<br />
                    <span>{a.description}</span>
                  </div>
                  <button className="delete-activity-btn" onClick={() => handleDeleteActivity(a.id)}>
                    ✕
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EntryDetail;
