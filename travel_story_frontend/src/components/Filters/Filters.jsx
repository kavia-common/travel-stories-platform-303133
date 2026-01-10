import React, { useState, useEffect } from 'react';
import { MdPushPin, MdCalendarToday, MdLocationOn, MdClose, MdExpandMore } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// PUBLIC_INTERFACE
/**
 * Filters component for travel stories with Ocean Professional theme.
 * Features chips/toggles for pinned, date range, location tags with hover/selected states,
 * mobile responsiveness (collapsible), and full accessibility.
 *
 * @param {boolean} showPinnedOnly - Whether to show only pinned stories
 * @param {Function} onTogglePinned - Callback to toggle pinned filter
 * @param {Date|null} startDate - Start date for date range filter
 * @param {Date|null} endDate - End date for date range filter
 * @param {Function} onDateRangeChange - Callback for date range change
 * @param {Array<string>} selectedLocations - Array of selected location tags
 * @param {Array<string>} availableLocations - Array of all available locations
 * @param {Function} onLocationToggle - Callback to toggle location filter
 * @param {Function} onClearFilters - Callback to clear all filters
 */
const Filters = ({
  showPinnedOnly,
  onTogglePinned,
  startDate,
  endDate,
  onDateRangeChange,
  selectedLocations = [],
  availableLocations = [],
  onLocationToggle,
  onClearFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const t = window.requestAnimationFrame(() => setIsMounted(true));
    return () => window.cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsExpanded(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const hasActiveFilters = showPinnedOnly || startDate || endDate || selectedLocations.length > 0;

  return (
    <aside
      className={`filters ${isMounted ? 'filters--mounted' : ''}`}
      role="complementary"
      aria-label="Story filters"
    >
      <div className="filters__header">
        <div className="filters__title-group">
          <h2 className="filters__title" id="filters-title">
            Filters
          </h2>
          {hasActiveFilters && (
            <span className="filters__badge" aria-label="Active filters count">
              {[showPinnedOnly, startDate || endDate, selectedLocations.length > 0].filter(Boolean).length}
            </span>
          )}
        </div>

        <div className="filters__actions">
          {hasActiveFilters && (
            <button
              className="filters__clear-btn"
              onClick={onClearFilters}
              aria-label="Clear all filters"
              title="Clear all filters"
            >
              Clear
            </button>
          )}
          {isMobile && (
            <button
              className={`filters__toggle ${isExpanded ? 'filters__toggle--expanded' : ''}`}
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-controls="filters-content"
              aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
            >
              <MdExpandMore aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div
        id="filters-content"
        className={`filters__content ${isExpanded ? 'filters__content--expanded' : ''}`}
        aria-labelledby="filters-title"
      >
        {/* Pinned Filter */}
        <div className="filters__section">
          <h3 className="filters__section-title">Status</h3>
          <button
            className={`filter-chip ${showPinnedOnly ? 'filter-chip--active' : ''}`}
            onClick={onTogglePinned}
            role="switch"
            aria-checked={showPinnedOnly}
            aria-label="Show only pinned stories"
          >
            <MdPushPin className="filter-chip__icon" aria-hidden="true" />
            <span className="filter-chip__label">Pinned Only</span>
          </button>
        </div>

        {/* Date Range Filter */}
        <div className="filters__section">
          <h3 className="filters__section-title">
            <MdCalendarToday className="filters__section-icon" aria-hidden="true" />
            Date Range
          </h3>
          <div className="filters__date-inputs">
            <div className="date-input-group">
              <label htmlFor="filter-start-date" className="date-input-label">
                From
              </label>
              <DatePicker
                id="filter-start-date"
                selected={startDate}
                onChange={(date) => onDateRangeChange(date, endDate)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                maxDate={endDate || new Date()}
                dateFormat="MMM d, yyyy"
                placeholderText="Start date"
                className="date-input"
                isClearable
                aria-label="Select start date"
              />
            </div>
            <div className="date-input-group">
              <label htmlFor="filter-end-date" className="date-input-label">
                To
              </label>
              <DatePicker
                id="filter-end-date"
                selected={endDate}
                onChange={(date) => onDateRangeChange(startDate, date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={new Date()}
                dateFormat="MMM d, yyyy"
                placeholderText="End date"
                className="date-input"
                isClearable
                aria-label="Select end date"
              />
            </div>
          </div>
        </div>

        {/* Location Tags Filter */}
        {availableLocations.length > 0 && (
          <div className="filters__section">
            <h3 className="filters__section-title">
              <MdLocationOn className="filters__section-icon" aria-hidden="true" />
              Locations
            </h3>
            <div className="filters__location-chips" role="group" aria-label="Location filters">
              {availableLocations.map((location) => {
                const isSelected = selectedLocations.includes(location);
                return (
                  <button
                    key={location}
                    className={`filter-chip filter-chip--location ${isSelected ? 'filter-chip--active' : ''}`}
                    onClick={() => onLocationToggle(location)}
                    role="switch"
                    aria-checked={isSelected}
                    aria-label={`Filter by ${location}`}
                  >
                    <span className="filter-chip__label">{location}</span>
                    {isSelected && <MdClose className="filter-chip__close" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Filters;
