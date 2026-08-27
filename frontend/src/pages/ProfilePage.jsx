import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import ToastAlert from '../components/ToastAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaUser, FaFileUpload, FaGithub, FaLinkedin, FaCheck } from 'react-icons/fa';

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    college: '',
    department: '',
    year: '4th Year',
    cgpa: 0,
    backlogs: 0,
    github: '',
    linkedin: '',
    resume: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/student/profile');
        if (res.data.profile) {
          const p = res.data.profile;
          setProfile({
            name: p.userId?.name || user?.name || '',
            phone: p.userId?.phone || user?.phone || '',
            college: p.college || '',
            department: p.department || '',
            year: p.year || '4th Year',
            cgpa: p.cgpa || 0,
            backlogs: p.backlogs || 0,
            github: p.github || '',
            linkedin: p.linkedin || '',
            resume: p.resume || ''
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ text: '', type: '' });

    try {
      const res = await API.put('/student/profile', profile);
      setMsg({ text: 'Profile updated & Readiness Score recalculated!', type: 'success' });
      if (res.data.profile?.userId) {
        setUser({ ...user, name: profile.name, phone: profile.phone });
      }
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to update profile.', type: 'danger' });
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await API.post('/student/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(prev => ({ ...prev, resume: res.data.resumeUrl }));
      setMsg({ text: 'Resume uploaded successfully!', type: 'success' });
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Resume upload failed.', type: 'danger' });
    }
  };

  if (loading) return <LoadingSpinner message="Loading Profile Details..." />;

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="p-3 rounded-circle bg-primary-subtle text-primary">
          <FaUser size={24} />
        </div>
        <div>
          <h2 className="fw-bold mb-0">Academic & Career Profile</h2>
          <p className="text-muted small mb-0">Update your details to automatically improve your Placement Readiness Score</p>
        </div>
      </div>

      <ToastAlert message={msg.text} type={msg.type} onClose={() => setMsg({ text: '', type: '' })} />

      <div className="row g-4">
        {/* Profile Update Form */}
        <div className="col-lg-8">
          <div className="glass-card p-4">
            <form onSubmit={handleProfileSubmit}>
              <h5 className="fw-bold mb-3 border-bottom pb-2">Personal & Academic Information</h5>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control glass-card text-body"
                    value={profile.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control glass-card text-body"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">College / Institution</label>
                  <input
                    type="text"
                    name="college"
                    className="form-control glass-card text-body"
                    value={profile.college}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Department / Stream</label>
                  <input
                    type="text"
                    name="department"
                    className="form-control glass-card text-body"
                    value={profile.department}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Year of Graduation</label>
                  <select name="year" className="form-select glass-card text-body" value={profile.year} onChange={handleChange}>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Academic CGPA (0 - 10)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    name="cgpa"
                    className="form-control glass-card text-body"
                    value={profile.cgpa}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Active Backlogs</label>
                  <input
                    type="number"
                    min="0"
                    name="backlogs"
                    className="form-control glass-card text-body"
                    value={profile.backlogs}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <h5 className="fw-bold mb-3 border-bottom pb-2">Professional Profiles</h5>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold d-flex align-items-center gap-1">
                    <FaGithub /> GitHub Repository Profile Link
                  </label>
                  <input
                    type="url"
                    name="github"
                    className="form-control glass-card text-body"
                    placeholder="https://github.com/yourusername"
                    value={profile.github}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold d-flex align-items-center gap-1">
                    <FaLinkedin /> LinkedIn Profile Link
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    className="form-control glass-card text-body"
                    placeholder="https://linkedin.com/in/yourusername"
                    value={profile.linkedin}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-brand rounded-3 py-2 px-4" disabled={saving}>
                {saving ? 'Saving Profile...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>

        {/* Resume Upload Box */}
        <div className="col-lg-4">
          <div className="glass-card p-4 text-center">
            <div className="p-3 rounded-circle bg-info-subtle text-info d-inline-block mb-3">
              <FaFileUpload size={32} />
            </div>
            <h5 className="fw-bold mb-2">Resume Document</h5>
            <p className="text-muted small mb-3">
              Upload your updated PDF resume to share with recruiting placement officers.
            </p>

            {profile.resume && (
              <div className="alert alert-success-subtle border border-success-subtle text-success small rounded-3 mb-3 p-2 d-flex align-items-center justify-content-center gap-2">
                <FaCheck /> Resume Uploaded! 
                <a href={profile.resume} target="_blank" rel="noreferrer" className="text-success text-decoration-underline fw-bold">
                  View PDF
                </a>
              </div>
            )}

            <form onSubmit={handleResumeUpload}>
              <div className="mb-3">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="form-control glass-card text-body small"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
              </div>
              <button type="submit" className="btn btn-outline-brand w-100 py-2" disabled={!file}>
                Upload Resume PDF
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
