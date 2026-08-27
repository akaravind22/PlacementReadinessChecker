import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import CircularScoreChart from '../components/CircularScoreChart';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ToastAlert from '../components/ToastAlert';
import { FaUser, FaEnvelope, FaPhone, FaGithub, FaLinkedin, FaFilePdf, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';

const StudentDetailPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifMsg, setNotifMsg] = useState('');
  const [sendingNotif, setSendingNotif] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchStudentDetail = async () => {
      try {
        const res = await API.get(`/officer/students/${id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetail();
  }, [id]);

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!notifMsg.trim()) return;

    setSendingNotif(true);
    setMsg({ text: '', type: '' });

    try {
      await API.post('/officer/notifications', {
        studentId: id,
        message: notifMsg
      });
      setNotifMsg('');
      setMsg({ text: 'Guidance notification sent to student!', type: 'success' });
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to send notification.', type: 'danger' });
    } finally {
      setSendingNotif(false);
    }
  };

  if (loading) return <LoadingSpinner message="Fetching Student File..." />;
  if (!data) return <div className="container py-5"><h4>Student Record Not Found</h4></div>;

  const { user, profile, skills, projects, certifications, internships, readinessData } = data;
  const breakdown = readinessData?.breakdown || {};

  return (
    <div className="container py-3">
      <Link to="/officer/students" className="btn btn-sm btn-outline-secondary mb-3 rounded-3">
        <FaArrowLeft className="me-1" /> Back to Student Roster
      </Link>

      <ToastAlert message={msg.text} type={msg.type} onClose={() => setMsg({ text: '', type: '' })} />

      {/* Header Info */}
      <div className="glass-card p-4 mb-4">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 rounded-circle bg-primary-subtle text-primary">
              <FaUser size={28} />
            </div>
            <div>
              <h3 className="fw-bold mb-1">{user?.name}</h3>
              <p className="text-muted small mb-1">
                <FaEnvelope className="me-1" /> {user?.email} • <FaPhone className="me-1" /> {user?.phone || 'N/A'}
              </p>
              <span className="badge bg-secondary-subtle text-body">
                {profile?.college} | {profile?.department} ({profile?.year})
              </span>
            </div>
          </div>

          <div className="d-flex gap-2">
            {profile?.github && (
              <a href={profile.github} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary rounded-3">
                <FaGithub /> GitHub
              </a>
            )}
            {profile?.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary rounded-3">
                <FaLinkedin /> LinkedIn
              </a>
            )}
            {profile?.resume && (
              <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn-sm btn-brand rounded-3">
                <FaFilePdf /> View Resume
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Score Chart */}
        <div className="col-lg-4">
          <div className="glass-card p-4 h-100 text-center d-flex flex-column align-items-center justify-content-center">
            <h5 className="fw-bold mb-2">Readiness Score</h5>
            <CircularScoreChart score={readinessData?.totalScore || 0} category={readinessData?.category} />
          </div>
        </div>

        {/* Breakdown */}
        <div className="col-lg-8">
          <div className="glass-card p-4 h-100">
            <h5 className="fw-bold mb-3">Score Component Breakdown</h5>
            <ProgressBar label="Academic CGPA & Backlogs" value={breakdown.cgpaScore || 0} max={20} variant="primary" />
            <ProgressBar label="Technical Skills Strength" value={breakdown.skillScore || 0} max={20} variant="success" />
            <ProgressBar label="Projects Portfolio" value={breakdown.projectScore || 0} max={20} variant="info" />
            <ProgressBar label="Certifications" value={breakdown.certScore || 0} max={15} variant="warning" />
            <ProgressBar label="Internship Experience" value={breakdown.internshipScore || 0} max={10} variant="secondary" />
            <ProgressBar label="Quizzes & Aptitude" value={breakdown.quizScore || 0} max={15} variant="danger" />
          </div>
        </div>
      </div>

      {/* Skills & Projects & Send Guidance Notification */}
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="glass-card p-4 mb-4">
            <h5 className="fw-bold mb-3">Technical Skills ({skills.length})</h5>
            <div className="d-flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s._id} className="badge bg-primary-subtle text-primary border border-primary-subtle p-2">
                  {s.skillName} ({s.level})
                </span>
              ))}
            </div>
          </div>

          <div className="glass-card p-4">
            <h5 className="fw-bold mb-3">Projects ({projects.length})</h5>
            {projects.map((p) => (
              <div key={p._id} className="p-3 rounded-3 border border-secondary border-opacity-10 mb-2 bg-body-tertiary">
                <h6 className="fw-bold mb-1">{p.title}</h6>
                <p className="text-muted small mb-1">{p.description}</p>
                <span className="badge bg-secondary-subtle text-body">{p.technology}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Send Direct Guidance Notification */}
        <div className="col-lg-5">
          <div className="glass-card p-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <FaPaperPlane className="text-primary" /> Send Guidance Notification
            </h5>
            <p className="text-muted small mb-3">
              Send personalized advice or drive updates directly to {user?.name}'s dashboard inbox.
            </p>

            <form onSubmit={handleSendNotification}>
              <div className="mb-3">
                <textarea
                  className="form-control glass-card text-body"
                  rows="4"
                  placeholder="e.g., Recommended to complete full-stack projects and clear active backlogs before TCS drive..."
                  value={notifMsg}
                  onChange={(e) => setNotifMsg(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-brand w-100 py-2" disabled={sendingNotif}>
                {sendingNotif ? 'Sending Notification...' : 'Send Direct Notification'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;
