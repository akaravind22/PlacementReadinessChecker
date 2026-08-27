import React, { useState, useEffect } from 'react';
import API from '../services/api';
import NotificationCard from '../components/NotificationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ToastAlert from '../components/ToastAlert';
import { FaBell } from 'react-icons/fa';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/student/notifications');
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await API.put(`/student/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      setMsg('Failed to update notification status.');
    }
  };

  if (loading) return <LoadingSpinner message="Fetching Notifications..." />;

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="p-3 rounded-circle bg-primary-subtle text-primary">
          <FaBell size={24} />
        </div>
        <div>
          <h2 className="fw-bold mb-0">Placement Cell Notifications</h2>
          <p className="text-muted small mb-0">Announcements, drive alerts, and guidance from Placement Officers</p>
        </div>
      </div>

      <ToastAlert message={msg} onClose={() => setMsg('')} />

      <div className="row justify-content-center">
        <div className="col-lg-10">
          {notifications.length === 0 ? (
            <div className="glass-card p-5 text-center text-muted">
              No notifications at this time.
            </div>
          ) : (
            notifications.map((notif) => (
              <NotificationCard key={notif._id} notification={notif} onMarkRead={handleMarkRead} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
