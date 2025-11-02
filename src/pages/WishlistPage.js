import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WishlistPage.css';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [newDestination, setNewDestination] = useState('');
  const [newTags, setNewTags] = useState('');
  const navigate = useNavigate();

  // ✅ Fetch wishlist from backend
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/wishlist');
        if (!response.ok) throw new Error('Failed to fetch wishlist');
        const data = await response.json();
        setWishlist(data);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        alert('Error fetching wishlist. Please try again later.');
      }
    };

    fetchWishlist();
  }, []);

  // ✅ Add a new destination
  const addDestination = async () => {
    if (!newDestination) {
      alert('Please enter a destination.');
      return;
    }

    const tagsArray = newTags.split(',').map(tag => tag.trim());
    const newItem = {
      name: newDestination,
      visited: false,
      tags: tagsArray.join(','), // store as a single string for simplicity
      linkedEntry: null,
    };

    try {
      const response = await fetch('http://localhost:8080/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) throw new Error('Failed to add destination');
      const savedItem = await response.json();

      setWishlist([...wishlist, savedItem]);
      setNewDestination('');
      setNewTags('');
    } catch (error) {
      console.error('Error adding destination:', error);
      alert('Error adding destination. Please try again.');
    }
  };

  // ✅ Mark as visited
  const markAsVisited = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/wishlist/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visited: true }),
      });

      if (!response.ok) throw new Error('Failed to update destination');

      setWishlist(wishlist.map(item =>
        item.id === id ? { ...item, visited: true } : item
      ));
    } catch (error) {
      console.error('Error updating destination:', error);
      alert('Error updating destination. Please try again.');
    }
  };

  // ✅ Delete destination
  const deleteDestination = async (id) => {
    if (!window.confirm('Are you sure you want to remove this destination?')) return;

    try {
      const response = await fetch(`http://localhost:8080/api/wishlist/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete destination');

      // remove from local list
      setWishlist(wishlist.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting destination:', error);
      alert('Error deleting destination. Please try again.');
    }
  };

  return (
    <div className="wishlist-container">
      <h2>Your Wishlist</h2>

      {/* Go Back Button */}
      <button onClick={() => navigate('/dashboard')} className="go-back-button">
        Go Back
      </button>

      <div className="wishlist-form">
        <input
          type="text"
          placeholder="New destination"
          value={newDestination}
          onChange={(e) => setNewDestination(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={newTags}
          onChange={(e) => setNewTags(e.target.value)}
        />
        <button onClick={addDestination}>Add to Wishlist</button>
      </div>

      <div className="wishlist-list">
        {wishlist.map(item => (
          <div
            key={item.id}
            className={`wishlist-item ${item.visited ? 'visited' : ''}`}
          >
            <h3>{item.name}</h3>
            <p>Tags: {item.tags || 'No tags'}</p>
            <p>Status: {item.visited ? 'Visited' : 'Not Visited'}</p>

            <div className="wishlist-actions">
              {!item.visited && (
                <button
                  className="mark-visited-btn"
                  onClick={() => markAsVisited(item.id)}
                >
                  ✅ Mark as Visited
                </button>
              )}
              <button
                className="delete-btn"
                onClick={() => deleteDestination(item.id)}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
