import React, { useState, useEffect } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { MdClose } from 'react-icons/md';
import ProfileInfo from '../Cards/ProfileInfo';

// PUBLIC_INTERFACE
/**
 * Enhanced Header component with Ocean Professional theme.
 * Features sticky positioning, gradient background, search bar with accessibility,
 * and smooth hover/focus states.
 *
 * @param {Object} userInfo - User information object
 * @param {string} searchQuery - Current search query
 * @param {Function} setSearchQuery - Function to update search query
 * @param {Function} onSearchNote - Callback for search action
 * @param {Function} handleClearSearch - Callback to clear search
 * @param {Function} onLogout - Callback for logout action
 */
const Header = ({ userInfo, searchQuery, setSearchQuery, onSearchNote, handleClearSearch, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const t = window.requestAnimationFrame(() => setIsMounted(true));
    return () => window.cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header
      className={`header ${isMounted ? 'header--mounted' : ''} ${isScrolled ? 'header--scrolled' : ''}`}
      role="banner"
    >
      <div className="header__container">
        <div className="header__brand">
          <div className="header__logo" role="img" aria-label="Travel Story logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M14.8 9.2 13.2 13.2 9.2 14.8 10.8 10.8 14.8 9.2Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h1 className="header__title">Travel Story</h1>
        </div>

        {userInfo && (
          <div className="header__actions">
            <div className="header__search" role="search">
              <label htmlFor="header-search-input" className="visually-hidden">
                Search stories
              </label>
              <div className="search-input-wrapper">
                <FaMagnifyingGlass className="search-input__icon" aria-hidden="true" />
                <input
                  id="header-search-input"
                  type="search"
                  className="search-input"
                  placeholder="Search stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  aria-label="Search stories by title, location, or content"
                />
                {searchQuery && (
                  <button
                    className="search-input__clear"
                    onClick={onClearSearch}
                    aria-label="Clear search"
                    title="Clear search"
                  >
                    <MdClose aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
