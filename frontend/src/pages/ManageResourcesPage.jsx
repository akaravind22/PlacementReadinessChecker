import React, { useState, useEffect } from 'react';
import API from '../services/api';
import ResourceCard from '../components/ResourceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ToastAlert from '../components/ToastAlert';
import { FaBook } from 'react-icons/fa';

const ManageResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchResources = async () => {
    try {
      const res = await API.get('/resources');
      setResources(res.data.resources || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/resources/${id}`);
      setMsg({ text: 'Study resource deleted.', type: 'info' });
      fetchResources();
    } catch (err) {
      setMsg({ text: 'Failed to delete resource.', type: 'danger' });
    }
  };

  if (loading) return <LoadingSpinner message="Loading Learning Resources..." />;

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="p-3 rounded-circle bg-primary-subtle text-primary">
          <FaBook size={24} />
        </div>
        <div>
          <h2 className="fw-bold mb-0">Manage Study Resources</h2>
          <p className="text-muted small mb-0">Review and delete uploaded learning files and external links</p>
        </div>
      </div>

      <ToastAlert message={msg.text} type={msg.type} onClose={() => setMsg({ text: '', type: '' })} />

      <div className="row g-4">
        {resources.map((r) => (
          <div key={r._id} className="col-md-6 col-lg-4">
            <ResourceCard resource={r} onDelete={handleDelete} isManage={true} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageResourcesPage;
