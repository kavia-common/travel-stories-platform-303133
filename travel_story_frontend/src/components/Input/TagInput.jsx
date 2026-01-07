import React, { useState } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';

// PUBLIC_INTERFACE
/**
 * TagInput component for adding and removing tags
 * @param {Array<string>} tags - Array of current tags
 * @param {Function} setTags - Function to update tags array
 */
const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addNewTag = () => {
    if (inputValue.trim() !== '') {
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addNewTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      {tags?.length > 0 && (
        <div className="tag-input-container">
          {tags.map((tag, index) => (
            <span key={index} className="tag-chip">
              {tag}
              <button onClick={() => handleRemoveTag(tag)}>
                <MdClose />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 mt-3">
        <input
          type="text"
          value={inputValue}
          className="input-box"
          placeholder="Add a location tag..."
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          className="btn-primary"
          onClick={addNewTag}
          style={{
            width: '44px',
            height: '44px',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          type="button"
        >
          <MdAdd className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default TagInput;
