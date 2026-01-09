import React, { useState } from 'react';
import { MdAdd, MdDelete, MdClose } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TagInput from '../../components/Input/TagInput';
import axiosInstance from '../../utils/axiosInstance';
import uploadImage from '../../utils/uploadImage';
import moment from 'moment';
import { FILE_BASE_URL } from '../../utils/constants';

const AddEditTravelStory = ({ storyInfo, type, onClose, getAllTravelStories }) => {
  const [title, setTitle] = useState(storyInfo?.title || '');
  const [story, setStory] = useState(storyInfo?.story || '');
  const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || []);
  const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate ? new Date(storyInfo.visitedDate) : null);
  const [error, setError] = useState(null);

  // Backward compatible: story may store either a Cloudinary URL (secure_url) or a legacy relative path.
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);

  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Update Visited Location
  const setVisitedLocationTags = (tags) => {
    setVisitedLocation(tags);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = await uploadImage(file);

      // uploadImage normalizes to always return imageUrl; still allow secure_url/url for safety.
      const url = data?.imageUrl || data?.secure_url || data?.url;
      if (!url) {
        setError('Upload succeeded but no image URL was returned.');
        return;
      }

      setStoryImg(url);
      setError('');
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteStoryImg = async () => {
    setStoryImg(null);
  };

  const handleAddOrUpdateClick = async () => {
    if (!title) {
      setError('Please enter the title');
      return;
    }
    if (!story) {
      setError('Please enter the story');
      return;
    }

    setError('');
    setIsSaving(true);

    if (type === 'edit') {
      await editTravelStory();
    } else {
      await addNewTravelStory();
    }

    setIsSaving(false);
  };

  const addNewTravelStory = async () => {
    try {
      const response = await axiosInstance.post('/stories', {
        title,
        story,
        imageUrl: storyImg || '',
        visitedLocation,
        visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
      });

      if (response.data && response.data.story) {
        getAllTravelStories();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const editTravelStory = async () => {
    try {
      const response = await axiosInstance.put('/stories/' + storyInfo._id, {
        title,
        story,
        imageUrl: storyImg || '',
        visitedLocation,
        visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
      });

      if (response.data && response.data.story) {
        getAllTravelStories();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const previewSrc = storyImg ? (storyImg.startsWith('http') ? storyImg : `${FILE_BASE_URL}${storyImg}`) : '';

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h5 className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>
          {type === 'add' ? '✨ Add New Story' : '✏️ Update Story'}
        </h5>

        <button className="icon-btn" onClick={onClose}>
          <MdClose className="text-2xl" style={{ color: 'var(--text-light)' }} />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="input-label">Title</label>
          <input
            type="text"
            className="input-box"
            placeholder="A Day at the Great Wall"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>

        <div>
          <label className="input-label">Date</label>
          <DatePicker
            selected={visitedDate}
            onChange={(date) => setVisitedDate(date)}
            dateFormat="MMMM d, yyyy"
            className="input-box"
            placeholderText="Select Date"
            wrapperClassName="react-datepicker-wrapper"
          />
        </div>

        <div>
          <label className="input-label">Your Story</label>
          <textarea
            className="input-box"
            placeholder="Share your amazing travel experience..."
            rows={8}
            value={story}
            onChange={({ target }) => setStory(target.value)}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div>
          <label className="input-label">Visited Locations</label>
          <TagInput tags={visitedLocation} setTags={setVisitedLocationTags} />
        </div>

        <div>
          <label className="input-label">Image</label>
          <div className="mt-2">
            {storyImg ? (
              <div className="image-preview-container">
                <img src={previewSrc} alt="Story" className="w-full h-full object-cover" />
                <button className="image-delete-btn" onClick={handleDeleteStoryImg}>
                  <MdDelete className="text-xl" style={{ color: 'var(--error)' }} />
                </button>
              </div>
            ) : (
              <div className="image-upload-area" onClick={() => document.getElementById('imageUpload').click()}>
                <MdAdd className="text-4xl" style={{ color: 'var(--primary)' }} />
                <span className="text-sm font-medium mt-2" style={{ color: 'var(--text-light)' }}>
                  {uploading ? 'Uploading...' : 'Click to add image'}
                </span>
                <input
                  type="file"
                  id="imageUpload"
                  className="hidden"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </div>
            )}
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm font-medium animate-fadeIn" style={{ marginTop: '0.5rem' }}>
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-4 mt-4">
          <button className="btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary px-8" onClick={handleAddOrUpdateClick} disabled={isSaving || uploading}>
            {isSaving ? 'Saving...' : type === 'add' ? 'Add Story' : 'Update Story'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditTravelStory;
