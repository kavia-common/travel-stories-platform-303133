import React from 'react';
import ProfileInfo from '../Cards/ProfileInfo';
import { useNavigate } from 'react-router-dom';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { MdClose } from 'react-icons/md';

// PUBLIC_INTERFACE
/**
 * Navbar component for application navigation with search and profile
 * @param {Object} userInfo - User information object
 * @param {string} searchQuery - Current search query
 * @param {Function} setSearchQuery - Function to update search query
 * @param {Function} onSearchNote - Callback for search action
 * @param {Function} handleClearSearch - Callback to clear search
 */
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
              placeholder="Search stories..."
              value={searchQuery}
              onChange={({ target }) => setSearchQuery(target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />

            {searchQuery && (
              <MdClose
                className="text-lg cursor-pointer mr-2"
                style={{ color: 'var(--text-light)', transition: 'color 0.2s' }}
                onClick={onClearSearch}
                onMouseEnter={(e) => (e.target.style.color = 'var(--text-main)')}
                onMouseLeave={(e) => (e.target.style.color = 'var(--text-light)')}
              />
            )}

            <FaMagnifyingGlass
              className="cursor-pointer"
              style={{ color: 'var(--text-light)', transition: 'color 0.2s' }}
              onClick={handleSearch}
              onMouseEnter={(e) => (e.target.style.color = 'var(--primary)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--text-light)')}
            />
          </div>

          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
