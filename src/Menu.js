import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Menu = ({ onSearch }) => {
  const [searchTag, setSearchTag] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTag); // Pass the search term to the parent component
  };

  return (
    <div className="menu-container">
      <button onClick={() => navigate('/add-entry')}>Add New Entry</button>
      <button onClick={() => navigate('/login')}>Logout</button>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by tag"
          value={searchTag}
          onChange={(e) => setSearchTag(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default Menu;
