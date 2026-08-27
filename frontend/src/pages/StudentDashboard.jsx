import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import CircularScoreChart from '../components/CircularScoreChart';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import DashboardCard from '../components/DashboardCard';
import { 
  FaCode, FaFolder, FaCertificate, FaBriefcase, 
  FaLightbulb, FaBuilding, FaBell, FaArrowRight 
} from 'react-icons/fa';

const StudentDashboard = () => {
  const [scoreData, setScoreData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certs, setCerts] = useState([]);
  const [internships, setInternships] = useState([]);
  const [drives, setDrives] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [scoreRes, profRes, skillRes, projRes, certRes, internRes, driveRes, notifRes] = await Promise.all([
          API.get('/student/readiness-score'),
          API.get('/student/profile'),
          API.get('/student/skills'),
          API.get('/student/projects'),
          API.get('/student/certifications'),
          API.get('/student/internships'),
          API.get('/drives'),
          API.get('/student/notifications')
        ]);

        setScoreData(scoreRes.data);
        setProfile(profRes.data.profile);
        setSkills(skillRes.data.skills || []);
        setProjects(projRes.data.projects || []);
        setCerts(certRes.data.certifications || []);
        setInternships(internRes.data.internships || []);
        setDrives(driveRes.data.drives || []);
        setNotifications(notifRes.data.notifications || []);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner message="Calculating Placement Readiness Score..." />;

  const breakdown = scoreData?.breakdown || {};

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1">Student Placement Dashboard</h2>
          <p className="text-muted small mb-0">
            {profile?.college || 'University Student'} • {profile?.department} ({profile?.year})
          </p>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <Link to="/student/report" className="btn btn-primary btn-sm rounded-3">
            View Placement Report
          </Link>
          <Link to="/student/profile" className="btn btn-outline-brand btn-sm rounded-3">
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Top Metrics Cards Grid */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <DashboardCard title="Technical Skills" value={skills.length} icon={FaCode} color="primary" />
        </div>
        <div className="col-6 col-md-3">
          <DashboardCard title="Projects Built" value={projects.length} icon={FaFolder} color="success" />
        </div>
        <div className="col-6 col-md-3">
          <DashboardCard title="Certifications" value={certs.length} icon={FaCertificate} color="warning" />
        </div>
        <div className="col-6 col-md-3">
          <DashboardCard title="Internships" value={internships.length} icon={FaBriefcase} color="info" />
        </div>
      </div>

      {/* Circular Score Gauge & Breakdown Section */}
      <div className="row g-4 mb-4">
        <div className="col-lg-5">
          <div className="glass-card p-4 h-100 d-flex flex-column align-items-center justify-content-center text-center">
            <h4 className="fw-bold mb-2">Placement Readiness Score</h4>
            <p className="text-muted small mb-3">Overall weighted index out of 100</p>
            
            <CircularScoreChart 
              score={scoreData?.totalScore || 0} 
              category={scoreData?.category || 'Needs Improvement'} 
            />

            <div className="mt-3 p-3 rounded-3 bg-secondary-subtle w-100 text-start">
              <div className="d-flex justify-content-between small text-muted mb-1">
                <span>Academic CGPA:</span>
                <strong className="text-body">{profile?.cgpa || 0} / 10</strong>
              </div>
              <div className="d-flex justify-content-between small text-muted">
                <span>Active Backlogs:</span>
                <strong className={profile?.backlogs > 0 ? 'text-danger' : 'text-success'}>
                  {profile?.backlogs || 0}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="glass-card p-4 h-100">
            <h4 className="fw-bold mb-3">Score Component Breakdown</h4>
            
            <ProgressBar label="Academic CGPA & Backlogs" value={breakdown.cgpaScore || 0} max={20} variant="primary" />
            <ProgressBar label="Technical Skills Strength" value={breakdown.skillScore || 0} max={20} variant="success" />
            <ProgressBar label="Projects Portfolio & Live Demos" value={breakdown.projectScore || 0} max={20} variant="info" />
            <ProgressBar label="Industry Certifications" value={breakdown.certScore || 0} max={15} variant="warning" />
            <ProgressBar label="Internship Experience" value={breakdown.internshipScore || 0} max={10} variant="secondary" />
            <ProgressBar label="Quiz & Aptitude Assessments" value={breakdown.quizScore || 0} max={15} variant="danger" />
          </div>
        </div>
      </div>

      {/* Personalized Improvement Suggestions Section */}
      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <div className="glass-card p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-3">
              <FaLightbulb className="text-warning" size={22} />
              <h4 className="fw-bold mb-0">Personalized Improvement Suggestions</h4>
            </div>

            {scoreData?.suggestions && scoreData.suggestions.length > 0 ? (
              <div className="d-flex flex-column gap-2">
                {scoreData.suggestions.map((sug, idx) => (
                  <div key={idx} className="p-3 rounded-3 border border-secondary border-opacity-10 d-flex align-items-start gap-3 bg-secondary-subtle">
                    <span className={`badge rounded-pill mt-1 ${sug.priority === 'High' ? 'bg-danger' : sug.priority === 'Medium' ? 'bg-warning text-dark' : 'bg-success'}`}>
                      {sug.priority} Priority
                    </span>
                    <p className="mb-0 small fw-medium text-body">{sug.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted small">No active suggestions. Keep up the high readiness level!</p>
            )}
          </div>
        </div>

        {/* Recent Notifications & Drives Preview */}
        <div className="col-lg-5">
          <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                  <FaBuilding className="text-primary" size={20} />
                  <h5 className="fw-bold mb-0">Active Placement Drives</h5>
                </div>
                <Link to="/student/drives" className="small text-primary text-decoration-none">
                  View All <FaArrowRight size={10} />
                </Link>
              </div>

              {drives.slice(0, 2).map((d) => (
                <div key={d._id} className="p-3 rounded-3 border border-secondary border-opacity-10 mb-2 bg-body-tertiary">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0 fw-bold">{d.company}</h6>
                    <span className="badge bg-success-subtle text-success">{d.package}</span>
                  </div>
                  <span className="text-muted small">{d.role}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-top border-secondary border-opacity-10">
              <div className="d-flex align-items-center justify-content-between">
                <span className="small text-muted d-flex align-items-center gap-1">
                  <FaBell className="text-info" /> Unread Notifications: {notifications.filter(n => !n.isRead).length}
                </span>
                <Link to="/student/notifications" className="btn btn-sm btn-outline-brand">
                  Notifications
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
