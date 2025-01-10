import { React, useState } from 'react';
import DropdownMenu from './DropdownMenu';
import './MenuBar.css';

const MenuBar = ({onSearch}) => {
const [searchTag, setSearchTag] = useState('');

const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTag); 
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
    </div>
  );
};

export default MenuBar;
