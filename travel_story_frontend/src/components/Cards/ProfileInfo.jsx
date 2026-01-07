import React from 'react';
import { getInitials } from '../../utils/helper';

// PUBLIC_INTERFACE
/**
 * ProfileInfo component displays user profile information with initials and logout button
 * @param {Object} userInfo - User information object containing fullName
 * @param {Function} onLogout - Callback function for logout action
 */
const ProfileInfo = ({ userInfo, onLogout }) => {
  if (!userInfo) return null;

  return (
    <div className="profile-info">
      <div className="initials">{getInitials(userInfo.fullName)}</div>
      <div>
        <p className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>
          {userInfo.fullName}
        </p>
        <button
          className="text-xs underline"
          style={{ 
            color: 'var(--text-light)', 
            transition: 'color 0.2s',
            fontWeight: '500'
          }}
          onClick={onLogout}
          onMouseEnter={(e) => (e.target.style.color = 'var(--error)')}
          onMouseLeave={(e) => (e.target.style.color = 'var(--text-light)')}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
