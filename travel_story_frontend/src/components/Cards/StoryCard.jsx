import React, { useState } from 'react';
import { MdCreate, MdDelete, MdPushPin } from 'react-icons/md';
import { GrMapLocation } from 'react-icons/gr';
import moment from 'moment';
import { FILE_BASE_URL } from '../../utils/constants';

// PUBLIC_INTERFACE
/**
 * StoryCard component displays a travel story with image, title, description, location, and action buttons.
 *
 * Enhanced with Ocean Professional theme, smooth transitions, accessible focus states,
 * improved hover interactions, and responsive touch-friendly targets.
 *
 * It supports Cloudinary URLs (secure_url) and legacy relative paths:
 * - If imgUrl is an absolute URL (http/https), it is rendered as-is.
 * - Otherwise it is treated as a backend-served relative path and prefixed with FILE_BASE_URL.
 *
 * @param {string|Object} imgUrl - URL of the story image. Can be a string or an upload payload object.
 * @param {string} title - Title of the story
 * @param {string|number} date - Date of the visit (timestamp or date string)
 * @param {string} story - Story description
 * @param {Array<string>} visitedLocation - Array of visited locations
 * @param {boolean} isFavourite - Whether the story is pinned/favourited
 * @param {Function} onFavouriteClick - Callback for favourite button click (kept for compatibility)
 * @param {Function} onEdit - Callback for edit button click
 * @param {Function} onClick - Callback for card click
 * @param {Function} onPinNote - Callback for pin button click
 * @param {Function} onDelete - Callback for delete button click
 */
const StoryCard = ({
  imgUrl,
  title,
  date,
  story,
  visitedLocation,
  isFavourite,
  onFavouriteClick, // eslint-disable-line no-unused-vars
  onEdit,
  onClick,
  onPinNote,
  onDelete,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const resolvedImgUrl =
    (typeof imgUrl === 'object' && imgUrl
      ? imgUrl.secure_url || imgUrl.imageUrl || imgUrl.url
      : imgUrl) || '';

  const imgSrc = resolvedImgUrl
    ? resolvedImgUrl.startsWith('http')
      ? resolvedImgUrl
      : `${FILE_BASE_URL}${resolvedImgUrl}`
    : '';

  return (
    <article className="story-card" aria-label={`Travel story: ${title}`}>
      {/* Pin Badge - Enhanced with better positioning and animation */}
      {isFavourite && (
        <div className="story-card__pin-badge" aria-label="Pinned story">
          <MdPushPin className="text-sm" aria-hidden="true" />
          <span>Pinned</span>
        </div>
      )}

      {/* Image Container with Aspect Ratio and Overlay */}
      <div className="story-card__image-container">
        {imgSrc && !imageError ? (
          <>
            {/* Skeleton loader while image loads */}
            {!imageLoaded && (
              <div className="story-card__image-skeleton" aria-hidden="true">
                <div className="story-card__image-skeleton-pulse" />
              </div>
            )}
            <img
              src={imgSrc}
              alt={title}
              className="story-card__image"
              onClick={onClick}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
              style={{ opacity: imageLoaded ? 1 : 0 }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick?.();
                }
              }}
              aria-label={`View full story: ${title}`}
            />
            {/* Subtle overlay for better text readability on hover */}
            <div className="story-card__image-overlay" aria-hidden="true" />
          </>
        ) : (
          <div className="story-card__image-placeholder" role="img" aria-label="No image available">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <span>No image</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="story-card__content">
        <div className="story-card__header">
          <div className="story-card__title-section">
            <h3 className="story-card__title">{title}</h3>
            <time
              className="story-card__date"
              dateTime={date ? moment(date).format('YYYY-MM-DD') : undefined}
            >
              {date ? moment(date).format('MMMM Do, YYYY') : 'Date not set'}
            </time>
          </div>

          {/* Enhanced Pin Button with better affordance */}
          <button
            className={`story-card__pin-btn ${isFavourite ? 'story-card__pin-btn--active' : ''}`}
            onClick={onPinNote}
            aria-label={isFavourite ? 'Unpin this story' : 'Pin this story'}
            aria-pressed={isFavourite}
            title={isFavourite ? 'Unpin story' : 'Pin story'}
          >
            <MdPushPin className="story-card__pin-icon" aria-hidden="true" />
          </button>
        </div>

        <p className="story-card__description">{story}</p>

        {/* Footer with Location and Actions */}
        <div className="story-card__footer">
          <div className="story-card__location" title={visitedLocation?.join(', ') || 'No location'}>
            <GrMapLocation className="story-card__location-icon" aria-hidden="true" />
            <span className="story-card__location-text">
              {visitedLocation && visitedLocation.length > 0
                ? visitedLocation.map((item, index) =>
                    visitedLocation.length === index + 1 ? `${item}` : `${item}, `
                  )
                : 'No location'}
            </span>
          </div>

          {/* Action Buttons with Enhanced Accessibility */}
          <div className="story-card__actions" role="group" aria-label="Story actions">
            <button
              className="story-card__action-btn story-card__action-btn--edit"
              onClick={onEdit}
              aria-label={`Edit ${title}`}
              title="Edit story"
            >
              <MdCreate className="story-card__action-icon" aria-hidden="true" />
            </button>
            <button
              className="story-card__action-btn story-card__action-btn--delete"
              onClick={onDelete}
              aria-label={`Delete ${title}`}
              title="Delete story"
            >
              <MdDelete className="story-card__action-icon" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default StoryCard;
