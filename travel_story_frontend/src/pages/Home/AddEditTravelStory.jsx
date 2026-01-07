import React, { useState } from 'react';
import { MdAdd, MdDelete, MdUpdate, MdClose } from 'react-icons/md';
import { GrMapLocation } from "react-icons/gr";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import TagInput from '../../components/Input/TagInput';
import axiosInstance from '../../utils/axiosInstance';
import uploadImage from '../../utils/uploadImage';
import moment from 'moment';

const AddEditTravelStory = ({
  storyInfo,
  type,
  onClose,
  getAllTravelStories,
}) => {
  const [title, setTitle] = useState(storyInfo?.title || '');
  const [story, setStory] = useState(storyInfo?.story || '');
  const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || []);
  const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate ? new Date(storyInfo.visitedDate) : null);
  const [error, setError] = useState(null);
  
  // Tag input is not in the design reqs specifically but good for visitedLocations if they are array? 
  // Wait, visitedLocation in the backend is likely an array of strings. 
  // I will reuse TagInput for visitedLocation for now as it fits "visitedLocation" as list.

  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
  const [uploading, setUploading] = useState(false);

  // Update Visited Location
  const setVisitedLocationTags = (tags) => {
      setVisitedLocation(tags);
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      try {
        const data = await uploadImage(file);
        // Assuming backend returns { imageUrl: '...' }
        setStoryImg(data.imageUrl); 
      } catch (err) {
        setError('Failed to upload image');
      } finally {
        setUploading(false);
      }
    }
  };
  
  const handleDeleteStoryImg = async () => {
      // In a real app we might delete from server, here we just remove reference
      setStoryImg(null);
  }

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

    if (type === 'edit') {
      await editTravelStory();
    } else {
      await addNewTravelStory();
    }
  };

  const addNewTravelStory = async () => {
    try {
        const response = await axiosInstance.post('/stories', {
            title,
            story,
            imageUrl: storyImg || "",
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
            setError("An unexpected error occurred. Please try again.");
        }
    }
  };

  const editTravelStory = async () => {
      try {
        const response = await axiosInstance.put('/stories/' + storyInfo._id, {
            title,
            story,
            imageUrl: storyImg || "",
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
            setError("An unexpected error occurred. Please try again.");
        }
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
         <h5 className="text-xl font-medium text-slate-700">
            {type === 'add' ? 'Add Story' : 'Update Story'}
         </h5>
         
         <button className="" onClick={onClose}>
            <MdClose className="text-xl text-slate-400" />
         </button>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label text-xs text-slate-400 uppercase">Title</label>
        <input
            type="text"
            className="text-2xl text-slate-950 outline-none"
            placeholder="A Day at the Great Wall"
            value={title}
            onChange={({target}) => setTitle(target.value)}
        />
        
        <div className="my-3">
             <label className="input-label text-xs text-slate-400 uppercase">Date</label>
             <DatePicker 
                selected={visitedDate}
                onChange={(date) => setVisitedDate(date)}
                className="w-full text-sm font-medium text-slate-950 outline-none bg-slate-50 p-2 rounded mt-1"
                placeholderText="Select Date"
             />
        </div>

        <div className="flex flex-col gap-2 mt-2">
            <label className="input-label text-xs text-slate-400 uppercase">Story</label>
            <textarea
                type="text"
                className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
                placeholder="Your Story"
                rows={10}
                value={story}
                onChange={({target}) => setStory(target.value)}
            />
        </div>
        
        <div className="pt-3">
            <label className="input-label text-xs text-slate-400 uppercase">Visited Locations</label>
            <TagInput tags={visitedLocation} setTags={setVisitedLocationTags} />
        </div>
        
        <div className="pt-3">
            <label className="input-label text-xs text-slate-400 uppercase">Image</label>
            <div className="mt-1">
                {storyImg ? (
                    <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
                        <img src={storyImg} alt="Story" className="w-full h-full object-cover" />
                        <button 
                            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
                            onClick={handleDeleteStoryImg}
                        >
                            <MdDelete className="text-red-500 text-lg" />
                        </button>
                    </div>
                ) : (
                    <div className="w-full h-[150px] bg-slate-100 rounded-lg flex items-center justify-center cursor-pointer border-2 border-dashed border-slate-200" onClick={() => document.getElementById('imageUpload').click()}>
                        <div className="flex flex-col items-center gap-1 text-slate-400">
                             <MdAdd className="text-3xl" />
                             <span className="text-sm">{uploading ? "Uploading..." : "Add Image"}</span>
                        </div>
                        <input type="file" id="imageUpload" className="hidden" onChange={handleImageUpload} />
                    </div>
                )}
            </div>
        </div>


        {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

        <div className="flex items-center justify-between gap-4 mt-6">
            <button className="btn-primary w-full p-3" onClick={handleAddOrUpdateClick}>
                {type === 'add' ? 'ADD STORY' : 'UPDATE STORY'}
            </button>
        </div>

      </div>
    </div>
  );
};

export default AddEditTravelStory;
