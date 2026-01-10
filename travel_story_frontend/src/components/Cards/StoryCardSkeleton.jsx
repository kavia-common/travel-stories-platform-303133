import React from 'react';

// PUBLIC_INTERFACE
/**
 * StoryCardSkeleton component displays a loading placeholder for story cards
 * with animated pulse effect during data fetch.
 */
const StoryCardSkeleton = () => {
  return (
    <div
      className="story-card"
      style={{
        pointerEvents: 'none',
        opacity: 0.7,
      }}
      aria-busy="true"
      aria-label="Loading story card"
    >
      {/* Image Skeleton */}
      <div
        style={{
          width: '100%',
          aspectRatio: '16 / 10',
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(245, 158, 11, 0.08) 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
            animation: 'skeletonPulse 1.8s ease-in-out infinite',
          }}
        />
      </div>

      {/* Content Skeleton */}
      <div className="story-card__content">
        {/* Header */}
        <div className="story-card__header">
          <div className="story-card__title-section" style={{ flex: 1 }}>
            <div
              style={{
                height: '1.125rem',
                width: '85%',
                background: 'rgba(0, 0, 0, 0.08)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '0.5rem',
              }}
            />
            <div
              style={{
                height: '0.8125rem',
                width: '50%',
                background: 'rgba(0, 0, 0, 0.06)',
                borderRadius: 'var(--radius-md)',
              }}
            />
          </div>
          <div
            style={{
              width: '44px',
              height: '44px',
              background: 'rgba(0, 0, 0, 0.06)',
              borderRadius: 'var(--radius-lg)',
            }}
          />
        </div>

        {/* Description Lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <div
            style={{
              height: '0.875rem',
              width: '100%',
              background: 'rgba(0, 0, 0, 0.06)',
              borderRadius: 'var(--radius-md)',
            }}
          />
          <div
            style={{
              height: '0.875rem',
              width: '95%',
              background: 'rgba(0, 0, 0, 0.06)',
              borderRadius: 'var(--radius-md)',
            }}
          />
          <div
            style={{
              height: '0.875rem',
              width: '70%',
              background: 'rgba(0, 0, 0, 0.06)',
              borderRadius: 'var(--radius-md)',
            }}
          />
        </div>

        {/* Footer */}
        <div className="story-card__footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
            <div
              style={{
                width: '1rem',
                height: '1rem',
                background: 'rgba(0, 0, 0, 0.08)',
                borderRadius: 'var(--radius-sm)',
              }}
            />
            <div
              style={{
                height: '0.8125rem',
                width: '120px',
                background: 'rgba(0, 0, 0, 0.06)',
                borderRadius: 'var(--radius-md)',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                background: 'rgba(0, 0, 0, 0.06)',
                borderRadius: 'var(--radius-md)',
              }}
            />
            <div
              style={{
                width: '38px',
                height: '38px',
                background: 'rgba(0, 0, 0, 0.06)',
                borderRadius: 'var(--radius-md)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryCardSkeleton;
