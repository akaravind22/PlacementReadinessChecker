import React, { useState, useEffect } from 'react';
import API from '../services/api';
import PlacementDriveCard from '../components/PlacementDriveCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaBuilding } from 'react-icons/fa';

const StudentDrivesPage = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);

  useEffect(() => {
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

    fetchDrives();
  }, []);

  if (loading) return <LoadingSpinner message="Fetching Active Placement Drives..." />;

  const applyToDrive = async (drive) => {
    setApplyingId(drive._id);
    try {
      await API.post(`/drives/${drive._id}/apply`);
      setDrives((items) => items.map((item) => item._id === drive._id ? { ...item, isApplied: true } : item));
    } catch (err) {
      console.error('Application failed:', err);
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="p-3 rounded-circle bg-primary-subtle text-primary">
          <FaBuilding size={24} />
        </div>
        <div>
          <h2 className="fw-bold mb-0">Campus Placement Drives</h2>
          <p className="text-muted small mb-0">Explore upcoming recruiting drives posted by the Training & Placement Cell</p>
        </div>
      </div>

      <div className="row g-4">
        {drives.length === 0 ? (
          <div className="col-12">
            <div className="glass-card p-5 text-center text-muted">
              No placement drives posted currently. Check back soon!
            </div>
          </div>
        ) : (
          drives.map((drive) => (
            <div key={drive._id} className="col-md-6 col-lg-4">
              <PlacementDriveCard drive={drive} onApply={applyToDrive} applying={applyingId === drive._id} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentDrivesPage;
