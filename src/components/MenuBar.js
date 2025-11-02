import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DropdownMenu from './DropdownMenu';
import './MenuBar.css';

const MenuBar = ({ onSearch }) => {
  const [searchTag, setSearchTag] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTag);
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail"); // ✅ remove login session
    navigate("/login"); // ✅ redirect to login
  };
  

  return (
    <div className="menu-bar">
      <DropdownMenu />

      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Search by tag"
          value={searchTag}
          onChange={(e) => setSearchTag(e.target.value)}
        />
      </form>

      {/* ✅ Added Logout Button */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      
    </div>
  );
};

export default MenuBar;
