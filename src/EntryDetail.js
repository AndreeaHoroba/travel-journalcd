import { doc, getDoc } from 'firebase/firestore'; // For fetching single document
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // For getting dynamic route params
import './EntryDetail.css';
import { db } from './firebase-config'; // Import your Firebase configuration


const EntryDetail = () => {
  const { entryId } = useParams(); // Get entry ID from the route params
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const docRef = doc(db, 'travel-journalcd', entryId); // Access specific document by ID
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

  if (!entry) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>{entry.title}</h1>
      <img src={entry.imageURL} alt={entry.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
      <p>{entry.description}</p>
    </div>
  );
};

export default EntryDetail;
