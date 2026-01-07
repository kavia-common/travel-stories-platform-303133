import React from 'react';

// PUBLIC_INTERFACE
/**
 * EmptyCard component displays an empty state with an icon and message
 * @param {string} imgSrc - Optional image source for the empty state
 * @param {string} message - Message to display in the empty state
 */
const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className="empty-card-container">
      <div className="empty-icon-wrapper">
        {imgSrc ? (
          <img src={imgSrc} alt="Empty state" />
        ) : (
          <div style={{ fontSize: '5rem' }}>📝</div>
        )}
      </div>

      <p className="empty-message">{message}</p>
    </div>
  );
};

export default EmptyCard;
