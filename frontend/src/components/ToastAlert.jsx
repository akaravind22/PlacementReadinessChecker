import React from 'react';

const ToastAlert = ({ message, type = 'danger', onClose }) => {
  if (!message) return null;

  return (
    <div className={`alert alert-${type} alert-dismissible fade show rounded-3 shadow-sm mb-4`} role="alert">
      {message}
      {onClose && (
        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
      )}
    </div>
  );
};

export default ToastAlert;
