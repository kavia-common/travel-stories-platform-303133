import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import Header from '../../components/Header/Header';
import Filters from '../../components/Filters/Filters';
import StoryCard from '../../components/Cards/StoryCard';
import StoryCardSkeleton from '../../components/Cards/StoryCardSkeleton';
import AddEditTravelStory from './AddEditTravelStory';
import Modal from 'react-modal';
import { MdAdd } from 'react-icons/md';
import EmptyCard from '../../components/Cards/EmptyCard';
import { getEmptyCardMessage } from '../../utils/helper';
import '../../components/Header/Header.css';
import '../../components/Filters/Filters.css';

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);

  // Mount reveal for header animation
  const [isMounted, setIsMounted] = useState(false);

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: 'add',
    data: null,
  });

  const navigate = useNavigate();

  // Set modal root
  Modal.setAppElement('#root');

  const pinnedCount = useMemo(
    () => allStories.reduce((acc, s) => acc + (s?.isFavourite ? 1 : 0), 0),
    [allStories]
  );

  // Extract all unique locations from stories
  const availableLocations = useMemo(() => {
    const locations = new Set();
    allStories.forEach((story) => {
      if (story.visitedLocation && Array.isArray(story.visitedLocation)) {
        story.visitedLocation.forEach((loc) => locations.add(loc));
      }
    });
    return Array.from(locations).sort();
  }, [allStories]);

  // Apply filters to stories
  useEffect(() => {
    let result = [...allStories];

    // Pinned filter
    if (showPinnedOnly) {
      result = result.filter((story) => story.isFavourite);
    }

    // Date range filter
    if (startDate || endDate) {
      result = result.filter((story) => {
        const storyDate = new Date(story.visitedDate);
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();
        return storyDate >= start && storyDate <= end;
      });
    }

    // Location filter
    if (selectedLocations.length > 0) {
      result = result.filter((story) => {
        if (!story.visitedLocation || !Array.isArray(story.visitedLocation)) return false;
        return story.visitedLocation.some((loc) => selectedLocations.includes(loc));
      });
    }

    setFilteredStories(result);
  }, [allStories, showPinnedOnly, startDate, endDate, selectedLocations]);

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

  const onLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleTogglePinned = () => {
    setShowPinnedOnly(!showPinnedOnly);
  };

  const handleDateRangeChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleLocationToggle = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location) ? prev.filter((loc) => loc !== location) : [...prev, location]
    );
  };

  const handleClearFilters = () => {
    setShowPinnedOnly(false);
    setStartDate(null);
    setEndDate(null);
    setSelectedLocations([]);
  };

  const hasActiveFilters = showPinnedOnly || startDate || endDate || selectedLocations.length > 0;

  useEffect(() => {
    // Trigger mount reveal on next frame for smoother initial paint
    const t = window.requestAnimationFrame(() => setIsMounted(true));
    return () => window.cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    getUserInfo();
    getAllTravelStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
        onLogout={onLogout}
      />

      <div className="container mx-auto px-6 py-10">
        {/* Enhanced Header Section */}
        <header className={`dashboard-header ${isMounted ? 'is-mounted' : ''}`} aria-label="Dashboard header">
          <div className="dashboard-header__bg" aria-hidden="true" />
          <div className="dashboard-header__content">
            <div className="dashboard-header__eyebrow">
              <span className="dashboard-header__dot" aria-hidden="true" />
              <span className="dashboard-header__eyebrow-text">
                {userInfo?.fullName ? `Welcome, ${userInfo.fullName}` : 'Your dashboard'}
              </span>
            </div>

            <h1 className="dashboard-header__title">Your Travel Stories</h1>

            <p className="dashboard-header__subtitle">
              Capture and cherish your travel memories with a clean, modern journaling flow.
            </p>

            <div className="dashboard-header__chips" aria-label="Story summary">
              <div className="dashboard-chip" role="group" aria-label="Total stories">
                <div className="dashboard-chip__label">Stories</div>
                <div className="dashboard-chip__value">{filteredStories?.length ?? 0}</div>
              </div>

              <div className="dashboard-chip" role="group" aria-label="Pinned stories">
                <div className="dashboard-chip__label">Pinned</div>
                <div className="dashboard-chip__value">{pinnedCount}</div>
              </div>

              <div className="dashboard-chip dashboard-chip--accent" role="group" aria-label="Filter status">
                <div className="dashboard-chip__label">Filters</div>
                <div className="dashboard-chip__value">{hasActiveFilters ? 'Active' : 'Off'}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Filters Section */}
        <Filters
          showPinnedOnly={showPinnedOnly}
          onTogglePinned={handleTogglePinned}
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={handleDateRangeChange}
          selectedLocations={selectedLocations}
          availableLocations={availableLocations}
          onLocationToggle={handleLocationToggle}
          onClearFilters={handleClearFilters}
        />

        {isLoading ? (
          <div className="grid grid-cols-3 gap-8 mt-8" role="status" aria-label="Loading stories">
            {[...Array(6)].map((_, index) => (
              <StoryCardSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        ) : filteredStories.length > 0 ? (
          <div className="grid grid-cols-3 gap-8 mt-8" role="list" aria-label="Travel stories">
            {filteredStories.map((item, index) => {
              return (
                <div
                  key={item._id}
                  role="listitem"
                  style={{
                    animation: `fadeIn 0.5s ease-out ${index * 0.08}s both`,
                  }}
                >
                  <StoryCard
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
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyCard
            message={
              hasActiveFilters
                ? 'No stories match the selected filters. Try adjusting your criteria.'
                : getEmptyCardMessage(searchQuery ? 'search' : 'No notes')
            }
          />
        )}
      </div>

      {/* Floating Action Button */}
      <button
        className="fab"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: 'add', data: null });
        }}
        aria-label="Add new travel story"
        title="Add New Story"
      >
        <MdAdd className="text-[32px]" aria-hidden="true" />
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
