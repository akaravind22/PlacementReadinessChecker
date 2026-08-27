import React from 'react';
import { FaBell, FaCheck } from 'react-icons/fa';

const NotificationCard = ({ notification, onMarkRead }) => {
  return (
    <div className={`glass-card p-3 mb-3 border-start border-4 ${notification.isRead ? 'border-secondary opacity-75' : 'border-primary'}`}>
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          <div className={`p-2 rounded-circle ${notification.isRead ? 'bg-secondary-subtle text-secondary' : 'bg-primary-subtle text-primary'}`}>
            <FaBell size={18} />
          </div>
          <div>
            <p className="mb-0 fw-medium text-body">{notification.message}</p>
            <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
              {new Date(notification.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        {!notification.isRead && onMarkRead && (
          <button 
            onClick={() => onMarkRead(notification._id)} 
            className="btn btn-sm btn-outline-primary rounded-circle p-2"
            title="Mark as Read"
          >
            <FaCheck size={12} />
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
