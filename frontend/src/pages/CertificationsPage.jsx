import React, { useState, useEffect } from 'react';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ToastAlert from '../components/ToastAlert';
import { FaCertificate, FaPlus, FaTrashAlt, FaExternalLinkAlt } from 'react-icons/fa';

const CertificationsPage = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    courseName: '',
    provider: '',
    completionDate: '',
    certificateURL: ''
  });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchCerts = async () => {
    try {
      const res = await API.get('/student/certifications');
      setCerts(res.data.certifications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.courseName.trim() || !formData.provider.trim()) return;

    try {
      await API.post('/student/certifications', formData);
      setFormData({ courseName: '', provider: '', completionDate: '', certificateURL: '' });
      setMsg({ text: 'Certification added successfully!', type: 'success' });
      fetchCerts();
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to add certification.', type: 'danger' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/student/certifications/${id}`);
      setMsg({ text: 'Certification deleted.', type: 'info' });
      fetchCerts();
    } catch (err) {
      setMsg({ text: 'Failed to delete.', type: 'danger' });
    }
  };

  if (loading) return <LoadingSpinner message="Loading Certifications..." />;

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="p-3 rounded-circle bg-warning-subtle text-warning">
          <FaCertificate size={24} />
        </div>
        <div>
          <h2 className="fw-bold mb-0">Certifications & Credentials</h2>
          <p className="text-muted small mb-0">Showcase verified online certifications (AWS, Meta, Coursera, Oracle)</p>
        </div>
      </div>

      <ToastAlert message={msg.text} type={msg.type} onClose={() => setMsg({ text: '', type: '' })} />

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="glass-card p-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <FaPlus size={16} /> Add Certification
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Course / Certification Name *</label>
                <input
                  type="text"
                  className="form-control glass-card text-body"
                  placeholder="AWS Certified Developer Associate"
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Issuing Organization / Provider *</label>
                <input
                  type="text"
                  className="form-control glass-card text-body"
                  placeholder="Amazon Web Services / Coursera"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Completion Date</label>
                <input
                  type="date"
                  className="form-control glass-card text-body"
                  value={formData.completionDate}
                  onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Verification Credential URL</label>
                <input
                  type="url"
                  className="form-control glass-card text-body"
                  placeholder="https://aws.amazon.com/verify/..."
                  value={formData.certificateURL}
                  onChange={(e) => setFormData({ ...formData, certificateURL: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-brand w-100 py-2">
                Save Certification
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="glass-card p-4">
            <h5 className="fw-bold mb-3">Your Certifications ({certs.length})</h5>

            {certs.length === 0 ? (
              <p className="text-muted small">No certifications added yet. Each certification boosts your readiness score by 5 points!</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {certs.map((c) => (
                  <div key={c._id} className="p-3 rounded-3 border border-secondary border-opacity-10 d-flex align-items-center justify-content-between bg-body-tertiary">
                    <div>
                      <h6 className="fw-bold mb-1">{c.courseName}</h6>
                      <span className="badge bg-warning-subtle text-warning border border-warning-subtle me-2">
                        {c.provider}
                      </span>
                      {c.completionDate && <span className="text-muted small">Issued: {c.completionDate}</span>}
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      {c.certificateURL && (
                        <a href={c.certificateURL} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">
                          <FaExternalLinkAlt size={12} /> Verify
                        </a>
                      )}
                      <button onClick={() => handleDelete(c._id)} className="btn btn-sm btn-outline-danger border-0">
                        <FaTrashAlt size={14} />
                      </button>
                    </div>
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

export default CertificationsPage;
