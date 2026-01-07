import React from 'react';
import { FaHeart } from "react-icons/fa6";
import { MdOutlineLocationOn, MdCreate, MdDelete, MdPushPin } from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";
import moment from 'moment';
import { FILE_BASE_URL } from '../../utils/constants';

const StoryCard = ({
  imgUrl,
  title,
  date,
  story,
  visitedLocation,
  isFavourite,
  onFavouriteClick,
  onEdit,
  onClick,
  onPinNote,
  onDelete
}) => {
  return (
    <div className="story-card">
      <img
        src={imgUrl && imgUrl.startsWith("http") ? imgUrl : `${FILE_BASE_URL}${imgUrl}`}
        alt={title}
        className="story-img cursor-pointer"
        onClick={onClick}
      />
      
      <div className="story-content">
        <div className="flex items-center justify-between">
            <div className="flex-1">
                <h6 className="story-title">{title}</h6>
                <span className="text-xs text-slate-500">
                    {date ? moment(date).format("Do MMM YYYY") : "-"}
                </span>
            </div>
            
             <MdPushPin className={`text-xl cursor-pointer ${isFavourite ? 'text-primary' : 'text-slate-300'}`} onClick={onPinNote} />
        </div>
        
        <p className="story-desc">{story}</p>

        <div className="story-footer">
          <div className="flex items-center gap-2 text-xs text-slate-500">
             <GrMapLocation className="text-sm" />
             {visitedLocation.map((item, index) => visitedLocation.length == index + 1 ? `${item}` : `${item}, `)}
          </div>

          <div className="flex items-center gap-2">
            <MdCreate
              className="icon-btn hover:text-green-600"
              onClick={onEdit}
            />
            <MdDelete
              className="icon-btn hover:text-red-500"
              onClick={onDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
