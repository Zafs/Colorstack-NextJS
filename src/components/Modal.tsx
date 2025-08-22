'use client';

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  showCloseButton?: boolean;
  customCloseButton?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  onClose,
  children,
  showCloseButton = true,
  customCloseButton
}) => {
  return (
    <div id="modal" className="modal" style={{ display: isOpen ? 'flex' : 'none' }}>
      <div id="modalContent" className="modal-content relative">
        {customCloseButton && (
          <div className="absolute -top-2 -right-2 z-10">
            {customCloseButton}
          </div>
        )}
        <h2 id="modalTitle" className="text-2xl font-bold text-white text-center mb-6">
          {title}
        </h2>
        <div id="modalBody" className="space-y-4">
          {children}
        </div>
        {showCloseButton && (
          <button 
            id="modalCloseBtn" 
            className="w-full mt-8 px-4 py-3 bg-gray-600 text-gray-200 font-medium rounded-lg transition-all hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={onClose}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
