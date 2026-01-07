import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import StoryCard from '../../components/Cards/StoryCard';
import AddEditTravelStory from './AddEditTravelStory';
import Modal from 'react-modal';
import { MdAdd } from 'react-icons/md';
import EmptyCard from '../../components/Cards/EmptyCard';
import { getEmptyCardMessage } from '../../utils/helper';

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: 'add',
    data: null,
  });

  const navigate = useNavigate();

  // Set modal root
  Modal.setAppElement('#root');

  // Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  // Get all stories
  const getAllTravelStories = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/stories');
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Search Stories
  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get('/stories/search', {
        params: { query },
      });

      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log('An unexpected error occurred.');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    getAllTravelStories();
  };

  // Delete Story
  const deleteTravelStory = async (data) => {
    const storyId = data._id;
    try {
      const response = await axiosInstance.delete('/stories/' + storyId);
      if (response.data && !response.data.error) {
        getAllTravelStories();
      }
    } catch (error) {
      console.log('Error deleting story');
    }
  };

  // Pin Story
  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;
    try {
      const response = await axiosInstance.put('/stories/' + storyId + '/pin', {
        isFavourite: !storyData.isFavourite,
      });

      if (response.data && response.data.story) {
        getAllTravelStories();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserInfo();
    getAllTravelStories();
    return () => {};
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>
            Your Travel Stories
          </h1>
          <p className="text-base" style={{ color: 'var(--text-light)' }}>
            Capture and cherish your travel memories
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse">
              <div className="text-2xl" style={{ color: 'var(--text-light)' }}>
                Loading your stories...
              </div>
            </div>
          </div>
        ) : allStories.length > 0 ? (
          <div className="grid grid-cols-3 gap-8 mt-8">
            {allStories.map((item, index) => {
              return (
                <div 
                  key={item._id} 
                  style={{ 
                    animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` 
                  }}
                >
                  <StoryCard
                    imgUrl={item.imageUrl}
                    title={item.title}
                    story={item.story}
                    date={item.visitedDate}
                    visitedLocation={item.visitedLocation}
                    isFavourite={item.isFavourite}
                    onEdit={() =>
                      setOpenAddEditModal({ isShown: true, type: 'edit', data: item })
                    }
                    onClick={() => {}}
                    onPinNote={() => updateIsFavourite(item)}
                    onDelete={() => deleteTravelStory(item)}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyCard message={getEmptyCardMessage(searchQuery ? 'search' : 'No notes')} />
        )}
      </div>

      {/* Floating Action Button */}
      <button
        className="fab"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: 'add', data: null });
        }}
        title="Add New Story"
      >
        <MdAdd className="text-[32px]" />
      </button>

      {/* Modal */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 999,
            backdropFilter: 'blur(4px)',
          },
        }}
        contentLabel=""
        className="modal-box"
      >
        <AddEditTravelStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: 'add', data: null });
          }}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>
    </>
  );
};

export default Home;
