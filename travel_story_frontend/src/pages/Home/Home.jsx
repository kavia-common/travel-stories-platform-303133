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
      if (error.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  // Get all stories
  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get('/stories');
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log('An unexpected error occurred. Please try again.');
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
      setSearchQuery("");
      getAllTravelStories();
  }

  // Delete Story
  const deleteTravelStory = async (data) => {
      const storyId = data._id;
      try {
        const response = await axiosInstance.delete('/stories/' + storyId);
        if (response.data && !response.data.error) {
            // Show toast or alert
            getAllTravelStories();
        }
      } catch (error) {
          console.log("Error deleting story");
      }
  }

  // Pin Story
  const updateIsFavourite = async (storyData) => {
      const storyId = storyData._id;
      try {
          const response = await axiosInstance.put('/stories/' + storyId + '/pin', {
              isFavourite: !storyData.isFavourite
          });
          
          if (response.data && response.data.story) {
             getAllTravelStories();
          }

      } catch (error) {
          console.log(error);
      }
  }


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
        {allStories.length > 0 ? (
            <div className="grid grid-cols-3 gap-8 mt-8">
            {allStories.map((item) => {
                return (
                <StoryCard
                    key={item._id}
                    imgUrl={item.imageUrl}
                    title={item.title}
                    story={item.story}
                    date={item.visitedDate}
                    visitedLocation={item.visitedLocation}
                    isFavourite={item.isFavourite}
                    onEdit={() => setOpenAddEditModal({ isShown: true, type: 'edit', data: item })}
                    onClick={() => {}}
                    onPinNote={() => updateIsFavourite(item)}
                    onDelete={() => deleteTravelStory(item)}
                />
                );
            })}
            </div>
        ) : (
            <EmptyCard message={getEmptyCardMessage(searchQuery ? "search" : "No notes")} />
        )}
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed right-10 bottom-10 z-50 shadow-2xl transition-all"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: 'add', data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-y-scroll outline-none"
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
