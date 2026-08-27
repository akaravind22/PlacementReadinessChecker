import React, { useState, useEffect } from 'react';
import API from '../services/api';
import ResourceCard from '../components/ResourceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ToastAlert from '../components/ToastAlert';
import { FaBook, FaFileUpload } from 'react-icons/fa';

const UploadResourcePage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    type: 'PDF',
    url: '',
    description: ''
  });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.url) return;

    try {
      await API.post('/resources', formData);
      setFormData({ title: '', type: 'PDF', url: '', description: '' });
      setMsg({ text: 'Resource uploaded successfully!', type: 'success' });
      fetchResources();
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to upload resource.', type: 'danger' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/resources/${id}`);
      setMsg({ text: 'Resource removed.', type: 'info' });
      fetchResources();
    } catch (err) {
      setMsg({ text: 'Failed to delete resource.', type: 'danger' });
    }
  };

  if (loading) return <LoadingSpinner message="Loading Learning Resources..." />;

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="p-3 rounded-circle bg-info-subtle text-info">
          <FaBook size={24} />
        </div>
        <div>
          <h2 className="fw-bold mb-0">Upload Study Resources</h2>
          <p className="text-muted small mb-0">Share preparation links, PDF question banks, and video tutorials with students</p>
        </div>
      </div>

      <ToastAlert message={msg.text} type={msg.type} onClose={() => setMsg({ text: '', type: '' })} />

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="glass-card p-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <FaFileUpload size={16} /> Material Upload
            </h5>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Material Title *</label>
                <input
                  type="text"
                  className="form-control glass-card text-body"
                  placeholder="Top 50 DSA Placement Questions"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Resource Format Type</label>
                <select
                  className="form-select glass-card text-body"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="PDF">PDF Document</option>
                  <option value="Video">Video Lecture</option>
                  <option value="Article">Article / Guide</option>
                  <option value="Repository">Code Repository</option>
                  <option value="Other">Other Material</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Resource URL / Link *</label>
                <input
                  type="url"
                  className="form-control glass-card text-body"
                  placeholder="https://example.com/dsa-guide.pdf"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Description</label>
                <textarea
                  className="form-control glass-card text-body"
                  rows="3"
                  placeholder="Brief overview of topics covered in this material..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-brand w-100 py-2">
                Publish Study Resource
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-8">
          <h5 className="fw-bold mb-3">Uploaded Learning Resources ({resources.length})</h5>
          <div className="row g-3">
            {resources.map((r) => (
              <div key={r._id} className="col-md-6">
                <ResourceCard resource={r} onDelete={handleDelete} isManage={true} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadResourcePage;
