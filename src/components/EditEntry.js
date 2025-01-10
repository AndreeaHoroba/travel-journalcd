import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase-config';
import './EditEntry.css';

const EditEntry = () => {
  const { entryId } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState({
    title: '',
    description: '',
    imageURL: '',
    tags: [],
    rating: 0,
    favorite: false,
  });

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const docRef = doc(db, 'travel-journalcd', entryId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEntry(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching entry:', error);
      }
    };

    fetchEntry();
  }, [entryId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEntry({
      ...entry,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'travel-journalcd', entryId);
      await updateDoc(docRef, entry);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating entry:', error);
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
            name="imageURL"
            value={entry.imageURL}
            onChange={handleInputChange}
          />
          <label>Tags</label>
          <input
            type="text"
            name="tags"
            value={entry.tags.join(', ')}
            onChange={(e) =>
              setEntry({ ...entry, tags: e.target.value.split(', ') })
            }
          />
          <label>Rating</label>
          <input
            type="number"
            name="rating"
            value={entry.rating}
            onChange={handleInputChange}
          />
          <label>Favorite</label>
          <input
            type="checkbox"
            name="favorite"
            checked={entry.favorite}
            onChange={() =>
              setEntry({ ...entry, favorite: !entry.favorite })
            }
          />
          <button type="button" onClick={handleSave}>
            Save Changes
          </button>
        </form>
        <button
          className="back-button"
          onClick={() => navigate('/dashboard')} 
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditEntry;
