import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

// PUBLIC_INTERFACE
/**
 * PasswordInput component with show/hide password toggle
 * @param {string} value - Current password value
 * @param {Function} onChange - Callback function when password changes
 * @param {string} placeholder - Placeholder text for the input
 */
const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="password-input-wrapper">
      <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? 'text' : 'password'}
        placeholder={placeholder || 'Password'}
      />

      {isShowPassword ? (
        <FaRegEye
          size={20}
          style={{ color: 'var(--primary)', transition: 'all 0.2s' }}
          className="cursor-pointer"
          onClick={toggleShowPassword}
        />
      ) : (
        <FaRegEyeSlash
          size={20}
          style={{ color: 'var(--text-lighter)', transition: 'all 0.2s' }}
          className="cursor-pointer"
          onClick={toggleShowPassword}
        />
      )}
    </div>
  );
};

export default PasswordInput;
