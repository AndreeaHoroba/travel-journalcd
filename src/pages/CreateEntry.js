import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase-config';
import './CreateEntry.css';

const CreateEntry = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false); 
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [rating, setRating] = useState(0); 
  const [favorite, setFavorite] = useState(false); 


  const handleImageUpload = async () => {
    if (!image) return null;

    try {
      const imageRef = ref(storage, `travel-images/${image.name}`);
      await uploadBytes(imageRef, image);
      const imageURL = await getDownloadURL(imageRef);
      console.log('Image uploaded and URL obtained:', imageURL);
      return imageURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsUploading(true); 
    try {
      const imageURL = await handleImageUpload();
      await addDoc(collection(db, 'travel-journalcd'), {
        title,
        description,
        imageURL: imageURL || null,
        tags, 
        timestamp: new Date(),
        location: { lat: 34.0522, lng: -118.2437 }, 
        rating: rating, 
        favorite: favorite, 

      });

      alert('Entry successfully added!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to add the entry. Please try again.');
    } finally {
      setIsUploading(false); 
    }
  };

  return (
    <div className="create-entry">
      <h2>Create New Travel Entry</h2>
      <form onSubmit={handleSubmit} className="create-entry-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="image-preview"
          />
        )}
         <input
          type="text"
          placeholder="Tags (comma-separated)"
          onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
        />
          <input
          type="number"
          placeholder="Rating (1-5)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          min="1"
          max="5"
        />
        <label>
          Favorite:
          <input
            type="checkbox"
            checked={favorite}
            onChange={() => setFavorite(!favorite)}
          />
        </label>
        <button type="submit" disabled={isUploading}>
  {isUploading ? 'Uploading...' : 'Save Entry'}
</button>

<button type="button" onClick={() => navigate('/dashboard')}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CreateEntry;
