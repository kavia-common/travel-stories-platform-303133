import React from 'react';
import ProfileInfo from '../Cards/ProfileInfo';
import { useNavigate } from 'react-router-dom';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { MdClose } from 'react-icons/md';

const Navbar = ({ userInfo, searchQuery, setSearchQuery, onSearchNote, handleClearSearch }) => {
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery('');
    handleClearSearch();
  };

  return (
    <div className="navbar">
      <h2 className="logo">Travel Story</h2>

      {userInfo && (
        <div className="flex items-center gap-4">
            <div className="search-bar">
            <input
                type="text"
                placeholder="Search Stories"
                value={searchQuery}
                onChange={({ target }) => setSearchQuery(target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />

            {searchQuery && (
                <MdClose
                className="text-xl text-slate-500 cursor-pointer hover:text-black mr-3"
                onClick={onClearSearch}
                />
            )}

            <FaMagnifyingGlass
                className="text-slate-400 cursor-pointer hover:text-black"
                onClick={handleSearch}
            />
            </div>
          
            <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
