import React from 'react';

const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <div className="w-60 h-60 flex items-center justify-center rounded-full bg-slate-100">
         {imgSrc ? <img src={imgSrc} alt="No notes" className="w-2/3" /> : <p className="text-4xl">📝</p>}
      </div>

      <p className="w-1/2 text-sm font-medium text-slate-700 text-center leading-7 mt-5">
        {message}
      </p>
    </div>
  );
};

export default EmptyCard;
