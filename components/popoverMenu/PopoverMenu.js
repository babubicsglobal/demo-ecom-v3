import React from 'react';

const PopoverMenu = ({ isOpen, onClose, children }) => {
  return isOpen ? (
    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-lg z-10">
      <div className="py-1">{children}</div>
    </div>
  ) : null;
};

export default PopoverMenu;