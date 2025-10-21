import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EditEntry.css';

const EditEntry = () => {
  const { entryId } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState({
    title: '',
    description: '',
    imageUrl: '',
    tags: '',
    rating: 0,
    favorite: false,
  });

  // ✅ Fetch entry from Spring Boot backend
  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/entries/${entryId}`);
        if (!response.ok) throw new Error('Failed to fetch entry');
        const data = await response.json();
        setEntry(data);
      } catch (error) {
        console.error('Error fetching entry:', error);
      }
    };
    fetchEntry();
  }, [entryId]);

  // ✅ Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEntry((prevEntry) => ({
      ...prevEntry,
      [name]: value,
    }));
  };

  // ✅ Save changes (PUT request)
  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/entries/${entryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });

      if (!response.ok) throw new Error('Failed to update entry');
      alert('Entry updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating entry:', error);
      alert('Failed to update entry.');
    }
  };

  return (
    <div className="edit-entry-container">
      <div className="edit-entry-form-container">
        <h2>Edit Entry</h2>
        <form>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={entry.title}
            onChange={handleInputChange}
          />

          <label>Description</label>
          <textarea
            name="description"
            value={entry.description}
            onChange={handleInputChange}
          />

          <label>Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={entry.imageUrl || ''}
            onChange={handleInputChange}
          />

          <label>Tags</label>
          <input
            type="text"
            name="tags"
            value={entry.tags || ''}
            onChange={handleInputChange}
          />

          <label>Rating</label>
          <input
            type="number"
            name="rating"
            value={entry.rating || 0}
            onChange={handleInputChange}
          />

          <label>Favorite</label>
          <input
            type="checkbox"
            name="favorite"
            checked={entry.favorite || false}
            onChange={() => setEntry({ ...entry, favorite: !entry.favorite })}
          />

          <button type="button" onClick={handleSave}>Save Changes</button>
        </form>

        <button className="back-button" onClick={() => navigate('/dashboard')}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditEntry;
