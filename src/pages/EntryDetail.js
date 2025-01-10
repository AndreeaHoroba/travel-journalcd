import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase-config';
import './EntryDetail.css';

// Image mapping constant
const imageMapping = {
  '0NGzyBB0W9XYowo8Iljq': '/japan.jpg',    
  'BnXU9zjjXBuz8ERQ8qME': '/madeira.jpg', 
  'EQZyHJZpyyHB7sybdeem': '/lefkada.jpeg', 
  'I2wfkaI2i4UbIpivDQbc': '/bucale.jpeg', 
  'leUo11JRQdNs90b6qoic': '/london.jpg', 
  'mfk8GLoNqa4EPRf0JnAR': '/rome.jpg',
  'zM77As6lHhtV11gDV9eK': '/nyc.jpg',


};

const EntryDetail = () => {
  const { entryId } = useParams();
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const docRef = doc(db, 'travel-journalcd', entryId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEntry({ id: entryId, ...docSnap.data() });
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
    <div style={{ padding: '80px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{
        backgroundColor: 'white',
        padding: '50px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        display: 'inline-block',
        textAlign: 'left',
        width: '100%',
        marginTop: '800px'
      }}>
        <h1 style={{ color: 'darkblue', marginBottom: '20px' }}>{entry.title}</h1>
        <img
          src={imageMapping[entry.id] || '/images/default.jpg'}
          alt={entry.title}
          style={{
            width: '100%',
            maxHeight: '400px',
            objectFit: 'cover',
            marginBottom: '20px'
          }}
        />
        <p style={{
          fontSize: '18px',
          lineHeight: '1.8',
          marginBottom: '20px',
        }}>
          {entry.description}
        </p>
      </div>
    </div>
  );
};

export default EntryDetail;
