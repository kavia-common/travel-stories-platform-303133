import React from 'react';
import { MdOutlineLocationOn, MdCreate, MdDelete, MdPushPin } from 'react-icons/md';
import { GrMapLocation } from 'react-icons/gr';
import moment from 'moment';
import { FILE_BASE_URL } from '../../utils/constants';

// PUBLIC_INTERFACE
/**
 * StoryCard component displays a travel story with image, title, description, location, and action buttons
 * @param {string} imgUrl - URL of the story image
 * @param {string} title - Title of the story
 * @param {string|number} date - Date of the visit (timestamp or date string)
 * @param {string} story - Story description
 * @param {Array<string>} visitedLocation - Array of visited locations
 * @param {boolean} isFavourite - Whether the story is pinned/favourited
 * @param {Function} onFavouriteClick - Callback for favourite button click
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
  onFavouriteClick,
  onEdit,
  onClick,
  onPinNote,
  onDelete,
}) => {
  return (
    <div className="story-card">
      {/* Pin Badge */}
      {isFavourite && (
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'linear-gradient(135deg, var(--secondary) 0%, var(--secondary-dark) 100%)',
            color: 'white',
            padding: '0.375rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 10,
            animation: 'scaleIn 0.3s ease-out',
          }}
        >
          <MdPushPin className="text-sm" />
          Pinned
        </div>
      )}

      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={imgUrl && imgUrl.startsWith('http') ? imgUrl : `${FILE_BASE_URL}${imgUrl}`}
          alt={title}
          className="story-img cursor-pointer"
          onClick={onClick}
        />
      </div>

      <div className="story-content">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h6 className="story-title">{title}</h6>
            <span className="text-xs" style={{ color: 'var(--text-light)', fontWeight: '500' }}>
              {date ? moment(date).format('MMMM Do, YYYY') : '-'}
            </span>
          </div>

          <button
            className="icon-btn"
            onClick={onPinNote}
            style={{
              background: isFavourite ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
              marginLeft: '0.5rem',
            }}
          >
            <MdPushPin
              className="text-xl"
              style={{
                color: isFavourite ? 'var(--secondary)' : 'var(--text-lighter)',
                transition: 'all 0.2s',
              }}
            />
          </button>
        </div>

        <p className="story-desc">{story}</p>

        <div className="story-footer">
          <div
            className="flex items-center gap-2"
            style={{
              fontSize: '0.8125rem',
              color: 'var(--text-light)',
              fontWeight: '500',
            }}
          >
            <GrMapLocation className="text-base" style={{ color: 'var(--primary)' }} />
            <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {visitedLocation && visitedLocation.length > 0
                ? visitedLocation.map((item, index) =>
                    visitedLocation.length === index + 1 ? `${item}` : `${item}, `
                  )
                : 'No location'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="icon-btn"
              onClick={onEdit}
              style={{ color: 'var(--text-light)' }}
              title="Edit Story"
            >
              <MdCreate className="text-xl hover:text-primary" style={{ transition: 'color 0.2s' }} />
            </button>
            <button
              className="icon-btn"
              onClick={onDelete}
              style={{ color: 'var(--text-light)' }}
              title="Delete Story"
            >
              <MdDelete className="text-xl hover:text-error" style={{ transition: 'color 0.2s' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
