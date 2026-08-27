import React, { useState, useEffect } from 'react';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ToastAlert from '../components/ToastAlert';
import { FaBriefcase, FaPlus, FaTrashAlt } from 'react-icons/fa';

const InternshipsPage = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    duration: '',
    description: ''
  });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchInternships = async () => {
    try {
      const res = await API.get('/student/internships');
      setInternships(res.data.internships || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.role.trim()) return;

    try {
      await API.post('/student/internships', formData);
      setFormData({ company: '', role: '', duration: '', description: '' });
      setMsg({ text: 'Internship added successfully!', type: 'success' });
      fetchInternships();
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to add internship.', type: 'danger' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/student/internships/${id}`);
      setMsg({ text: 'Internship entry removed.', type: 'info' });
      fetchInternships();
    } catch (err) {
      setMsg({ text: 'Failed to delete.', type: 'danger' });
    }
  };

  if (loading) return <LoadingSpinner message="Loading Internships..." />;

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="p-3 rounded-circle bg-info-subtle text-info">
          <FaBriefcase size={24} />
        </div>
        <div>
          <h2 className="fw-bold mb-0">Internships & Work Experience</h2>
          <p className="text-muted small mb-0">Document your practical industry experience and company projects</p>
        </div>
      </div>

      <ToastAlert message={msg.text} type={msg.type} onClose={() => setMsg({ text: '', type: '' })} />

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="glass-card p-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <FaPlus size={16} /> Add Internship Entry
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Company Name *</label>
                <input
                  type="text"
                  className="form-control glass-card text-body"
                  placeholder="Microsoft India / Infosys"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Designation / Role *</label>
                <input
                  type="text"
                  className="form-control glass-card text-body"
                  placeholder="Software Engineering Intern"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Duration / Timeline</label>
                <input
                  type="text"
                  className="form-control glass-card text-body"
                  placeholder="3 Months (Summer 2025)"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Work Summary & Key Contributions</label>
                <textarea
                  className="form-control glass-card text-body"
                  rows="3"
                  placeholder="Worked on cloud microservices, REST APIs, and frontend integration..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-brand w-100 py-2">
                Save Internship
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="glass-card p-4">
            <h5 className="fw-bold mb-3">Internship History ({internships.length})</h5>

            {internships.length === 0 ? (
              <p className="text-muted small">No internship records added. Internships add up to 10 points to your readiness score.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {internships.map((i) => (
                  <div key={i._id} className="p-3 rounded-3 border border-secondary border-opacity-10 bg-body-tertiary">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div>
                        <h6 className="fw-bold mb-0">{i.role}</h6>
                        <span className="text-primary small fw-semibold">{i.company}</span>
                        {i.duration && <span className="text-muted ms-2 small">({i.duration})</span>}
                      </div>

                      <button onClick={() => handleDelete(i._id)} className="btn btn-sm btn-outline-danger border-0">
                        <FaTrashAlt size={14} />
                      </button>
                    </div>
                    <p className="text-muted small mb-0">{i.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipsPage;
