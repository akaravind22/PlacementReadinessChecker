import React, { useState, useEffect } from 'react';
import API from '../services/api';
import PlacementDriveCard from '../components/PlacementDriveCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ToastAlert from '../components/ToastAlert';
import { FaBuilding, FaPlus } from 'react-icons/fa';

const PostDrivePage = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    package: '',
    eligibility: 'CGPA >= 7.0, No active backlogs',
    location: 'Bengaluru / Hybrid',
    deadline: '',
    description: '',
    applyLink: ''
  });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company || !formData.role || !formData.package || !formData.deadline) return;

    try {
      await API.post('/drives', formData);
      setFormData({
        company: '',
        role: '',
        package: '',
        eligibility: 'CGPA >= 7.0, No active backlogs',
        location: 'Bengaluru / Hybrid',
        deadline: '',
        description: '',
        applyLink: ''
      });
      setMsg({ text: 'Placement drive published successfully!', type: 'success' });
      fetchDrives();
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to post drive.', type: 'danger' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/drives/${id}`);
      setMsg({ text: 'Placement drive removed.', type: 'info' });
      fetchDrives();
    } catch (err) {
      setMsg({ text: 'Failed to delete drive.', type: 'danger' });
    }
  };

  if (loading) return <LoadingSpinner message="Loading Placement Drives..." />;

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="p-3 rounded-circle bg-primary-subtle text-primary">
          <FaBuilding size={24} />
        </div>
        <div>
          <h2 className="fw-bold mb-0">Post Placement Drive</h2>
          <p className="text-muted small mb-0">Publish recruitment announcements and company eligibility details for students</p>
        </div>
      </div>

      <ToastAlert message={msg.text} type={msg.type} onClose={() => setMsg({ text: '', type: '' })} />

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="glass-card p-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <FaPlus size={16} /> Drive Form
            </h5>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Company Name *</label>
                <input
                  type="text"
                  className="form-control glass-card text-body"
                  placeholder="Google India"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Job Designation / Role *</label>
                <input
                  type="text"
                  className="form-control glass-card text-body"
                  placeholder="Associate Software Engineer"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Salary Package (LPA) *</label>
                <input
                  type="text"
                  className="form-control glass-card text-body"
                  placeholder="14 LPA"
                  value={formData.package}
                  onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Eligibility Criteria</label>
                <input
                  type="text"
                  className="form-control glass-card text-body"
                  value={formData.eligibility}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Location</label>
                <input
                  type="text"
                  className="form-control glass-card text-body"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Application Deadline Date *</label>
                <input
                  type="date"
                  className="form-control glass-card text-body"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Application URL Link</label>
                <input
                  type="url"
                  className="form-control glass-card text-body"
                  placeholder="https://careers.google.com"
                  value={formData.applyLink}
                  onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Job Description</label>
                <textarea
                  className="form-control glass-card text-body"
                  rows="3"
                  placeholder="Overview of hiring process, rounds, and requirements..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-brand w-100 py-2">
                Publish Drive to Portal
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-7">
          <h5 className="fw-bold mb-3">Active Placement Drives ({drives.length})</h5>
          <div className="row g-3">
            {drives.map((d) => (
              <div key={d._id} className="col-md-6">
                <PlacementDriveCard drive={d} onDelete={handleDelete} isManage={true} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDrivePage;
