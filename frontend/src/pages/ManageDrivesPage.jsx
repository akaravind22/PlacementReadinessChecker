import React, { useState, useEffect } from 'react';
import API from '../services/api';
import PlacementDriveCard from '../components/PlacementDriveCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ToastAlert from '../components/ToastAlert';
import { FaBuilding } from 'react-icons/fa';

const ManageDrivesPage = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchDrives = async () => {
    try {
      const res = await API.get('/drives');
      setDrives(res.data.drives || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/drives/${id}`);
      setMsg({ text: 'Placement drive removed by Admin.', type: 'info' });
      fetchDrives();
    } catch (err) {
      setMsg({ text: 'Failed to delete drive.', type: 'danger' });
    }
  };

  if (loading) return <LoadingSpinner message="Loading Placement Drives..." />;

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="p-3 rounded-circle bg-secondary-subtle text-body">
          <FaBuilding size={24} />
        </div>
        <div>
          <h2 className="fw-bold mb-0">Manage Placement Drives</h2>
          <p className="text-muted small mb-0">System audit of all published company recruiting drives</p>
        </div>
      </div>

      <ToastAlert message={msg.text} type={msg.type} onClose={() => setMsg({ text: '', type: '' })} />

      <div className="row g-4">
        {drives.map((d) => (
          <div key={d._id} className="col-md-6 col-lg-4">
            <PlacementDriveCard drive={d} onDelete={handleDelete} isManage={true} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageDrivesPage;
