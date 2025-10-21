import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EntryDetail.css';

const EntryDetail = () => {
  const { entryId } = useParams();
  const [entry, setEntry] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/entries/${entryId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch entry details');
        }
        const data = await response.json();
        setEntry(data);
      } catch (error) {
        console.error('❌ Error fetching entry:', error);
      }
    };

    fetchEntry();
  }, [entryId]);

  if (!entry) {
    return <div className="loading">Loading...</div>;
  }

  // ✅ Încearcă să detecteze dacă imaginea e:
  // - un Base64 string (din Firebase sau altă sursă)
  // - sau un link HTTP generat de Spring Boot (ex: http://localhost:8080/uploads/...).
  const getImageSrc = (url) => {
    if (!url) return '/default.jpg'; // fallback dacă nu există
    if (url.startsWith('data:image')) return url;
    if (url.startsWith('http')) return url;
    return `http://localhost:8080${url}`; // fallback relativ (ex: /uploads/image.jpg)
  };

  return (
    <div className="entry-detail-container">
      {/* 🔙 Buton de întoarcere */}
      <button className="back-button" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>

      <div className="entry-detail-card">
        <h1 className="entry-title">{entry.title}</h1>

        {/* 🖼️ Afișarea imaginii */}
        {entry.imageUrl ? (
          <img
            src={getImageSrc(entry.imageUrl)}
            alt={entry.title}
            className="entry-image"
          />
        ) : (
          <div className="no-image">No image available</div>
        )}

        {/* 📄 Descriere */}
        <p className="entry-description">{entry.description}</p>

        {/* ℹ️ Info adițională */}
        <div className="entry-info">
          <p><strong>Tags:</strong> {entry.tags || 'No tags'}</p>
          <p><strong>Rating:</strong> {entry.rating || 'N/A'}</p>
          <p><strong>Favorite:</strong> {entry.favorite ? '❤️ Yes' : '💔 No'}</p>
        </div>
      </div>
    </div>
  );
};

export default EntryDetail;
