import React from 'react';
import { FaBell, FaCheck, FaUserTie } from 'react-icons/fa';

const NotificationCard = ({ notification, onMarkRead }) => {
  const baseSenderName = notification.sender?.name || notification.senderId?.name || notification.senderName || 'Placement Cell';
  const senderName = baseSenderName === 'Placement Cell'
    ? 'Placement Cell'
    : `${baseSenderName} from Placement Cell`;
  const senderRole = '';

  return (
    <div className={`glass-card p-3 mb-3 border-start border-4 ${notification.isRead ? 'border-secondary opacity-75' : 'border-primary'}`}>
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          <div className={`p-2 rounded-circle ${notification.isRead ? 'bg-secondary-subtle text-secondary' : 'bg-primary-subtle text-primary'}`}>
            <FaBell size={18} />
          </div>
          <div>
            <p className="mb-0 fw-medium text-body">{notification.message}</p>
            <div className="small text-primary fw-semibold mt-1 d-flex align-items-center gap-1">
              <FaUserTie size={12} />
              <span>Sent by {senderName}{senderRole ? ` · ${senderRole}` : ''}</span>
            </div>
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
