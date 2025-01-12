import { addDoc, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase-config';
import './WishlistPage.css';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [newDestination, setNewDestination] = useState('');
  const [newTags, setNewTags] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const wishlistCollection = collection(db, 'wishlist');
        const wishlistSnapshot = await getDocs(wishlistCollection);
        const wishlistList = wishlistSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWishlist(wishlistList);
      } catch (error) {
        console.error("Error fetching wishlist: ", error);
        alert("Error fetching wishlist. Please try again later.");
      }
    };

    fetchWishlist();
  }, []);

  const addDestination = async () => {
    if (!newDestination) {
      alert("Please enter a destination.");
      return;
    }

    try {
      const tagsArray = newTags.split(',').map(tag => tag.trim());
      const docRef = await addDoc(collection(db, 'wishlist'), {
        name: newDestination,
        visited: false,
        tags: tagsArray,
        linkedEntry: null,
      });
      setWishlist([...wishlist, { id: docRef.id, name: newDestination, visited: false, tags: tagsArray, linkedEntry: null }]);
      setNewDestination('');
      setNewTags('');
    } catch (error) {
      console.error("Error adding destination: ", error);
      alert("Error adding destination. Please try again.");
    }
  };

  const markAsVisited = async (id) => {
    try {
      const wishlistDoc = doc(db, 'wishlist', id);
  
      await updateDoc(wishlistDoc, { visited: true });  
  
      setWishlist(wishlist.map(item => 
        item.id === id ? { ...item, visited: true } : item
      ));
  
    } catch (error) {
      console.error("Error updating destination: ", error);
      alert("Error updating destination. Please try again.");
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
          <div key={item.id} className={`wishlist-item ${item.visited ? 'visited' : ''}`}>
            <h3>{item.name}</h3>
            <p>Tags: {item.tags.join(', ')}</p>
            <p>Status: {item.visited ? 'Visited' : 'Not Visited'}</p>
            {!item.visited && (
              <button onClick={() => markAsVisited(item.id)}>Mark as Visited</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
