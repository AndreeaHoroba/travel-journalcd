import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateEntry.css';

const CreateEntry = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [tags, setTags] = useState([]);
  const [rating, setRating] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const navigate = useNavigate();

  // Convert image file to Base64 string for backend upload
  const handleImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let imageBase64 = null;
      if (image) {
        imageBase64 = await handleImageToBase64(image);
      }

      const newEntry = {
        title,
        description,
        imageUrl: imageBase64, // backend stores it as Base64 or URL
        tags: tags.join(','),
        rating,
        favorite,
      };

      const response = await fetch('http://localhost:8080/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry),
      });

      if (!response.ok) {
        throw new Error('Failed to save entry');
      }

      alert('Entry successfully added!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding entry:', error);
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
          onChange={(e) =>
            setTags(e.target.value.split(',').map((tag) => tag.trim()))
          }
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
