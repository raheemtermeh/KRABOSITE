// components/Snackbar.js

import React, { useEffect } from 'react';

function Snackbar({ message = 'This is a snackbar!', show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose(); 
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const snackbarStyles = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    color:"#fff",
    backgroundColor:"#4CAF50",
    zIndex: 1050,
    transition: 'opacity 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius:10
  };

  const closeButtonStyles = {
    marginRight: '10px',
    background: 'transparent',
    border: 'none',
    fontSize: '2rem',
    fontWeight:'bolder',
    color: '#fff',
    cursor: 'pointer',
  };

  return (
    <div
      style={snackbarStyles}
      className="alert alert-dismissible fade show"
      role="alert"
    >
      <button style={closeButtonStyles} onClick={onClose} aria-label="Close">
        &times;
      </button>
      {message}
    </div>
  );
}

export default Snackbar;
