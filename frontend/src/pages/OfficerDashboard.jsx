import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import DashboardCard from '../components/DashboardCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaUsers, FaBuilding, FaBook, FaChartBar, FaPlusCircle, FaSearch, FaEye, FaQuestionCircle, FaUserCheck } from 'react-icons/fa';

const OfficerDashboard = () => {
  const [students, setStudents] = useState([]);
  const [drives, setDrives] = useState([]);
  const [resources, setResources] = useState([]);
  const [reports, setReports] = useState([]);
  const [applications, setApplications] = useState([]);
  const [driveViews, setDriveViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOfficerData = async () => {
      try {
        const [stuRes, drvRes, resRes, repRes, appRes, viewRes] = await Promise.all([
          API.get('/officer/students'),
          API.get('/drives'),
          API.get('/resources'),
          API.get('/officer/reports'),
          API.get('/officer/drive-applications'),
          API.get('/officer/drive-views')
        ]);
        setStudents(stuRes.data.students || []);
        setDrives(drvRes.data.drives || []);
        setResources(resRes.data.resources || []);
        setReports(repRes.data.reports || []);
        setApplications(appRes.data.applications || []);
        setDriveViews(viewRes.data.views || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOfficerData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading Placement Officer Dashboard..." />;

  const filteredStudents = students.filter(s => 
    s.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">Placement Officer Control Center</h2>
          <p className="text-muted small mb-0">Monitor student progress, guide careers, publish drives, and upload study materials</p>
        </div>

        <div className="d-flex gap-2">
          <Link to="/officer/post-drive" className="btn btn-brand btn-sm d-flex align-items-center gap-1">
            <FaPlusCircle /> Post Drive
          </Link>
          <Link to="/officer/upload-resource" className="btn btn-outline-brand btn-sm d-flex align-items-center gap-1">
            <FaBook /> Upload Material
          </Link>
          <Link to="/officer/quizzes" className="btn btn-outline-brand btn-sm d-flex align-items-center gap-1">
            <FaQuestionCircle /> Manage Quizzes
          </Link>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <DashboardCard title="Registered Students" value={students.length} icon={FaUsers} color="primary" />
        </div>
        <div className="col-6 col-md-3">
          <DashboardCard title="Active Drives" value={drives.length} icon={FaBuilding} color="success" />
        </div>
        <div className="col-6 col-md-3">
          <DashboardCard title="Learning Resources" value={resources.length} icon={FaBook} color="info" />
        </div>
        <div className="col-6 col-md-3">
          <DashboardCard title="Generated Reports" value={reports.length} icon={FaChartBar} color="warning" />
        </div>
      </div>

      <div className="glass-card p-4 mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2"><FaUserCheck className="text-success" size={20} /><h4 className="fw-bold mb-0">Placement Drive Applications</h4></div>
          <span className="badge bg-success-subtle text-success">{applications.length} Applied</span>
        </div>
        {applications.length === 0 ? <p className="text-muted mb-0">No students have applied to a placement drive yet.</p> : <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-body"><thead><tr><th>Student</th><th>Drive</th><th>Department</th><th>Readiness Score</th><th>Applied On</th><th className="text-end">Profile</th></tr></thead><tbody>
            {applications.map((application) => <tr key={application._id}>
              <td><div className="fw-bold">{application.student.name}</div><div className="small text-muted">{application.student.email}</div></td>
              <td><div className="fw-semibold">{application.drive.company}</div><div className="small text-muted">{application.drive.role}</div></td>
              <td>{application.student.department}</td><td className="fw-bold">{application.student.readinessScore} / 100</td>
              <td className="small">{new Date(application.appliedAt).toLocaleDateString()}</td>
              <td className="text-end"><Link to={`/officer/students/${application.student._id}`} className="btn btn-sm btn-outline-primary rounded-3"><FaEye size={12} /> Inspect</Link></td>
            </tr>)}
          </tbody></table>
        </div>}
      </div>

      <div className="glass-card p-4 mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2"><FaEye className="text-primary" size={20} /><h4 className="fw-bold mb-0">Student Drive Views</h4></div>
          <span className="badge bg-primary-subtle text-primary">{driveViews.length} Viewed</span>
        </div>
        {driveViews.length === 0 ? <p className="text-muted mb-0">No student has opened a drive’s company information yet.</p> : <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-body"><thead><tr><th>Student</th><th>Drive</th><th>Department</th><th>Readiness Score</th><th>Views</th><th>Last Opened</th></tr></thead><tbody>
            {driveViews.map((view) => <tr key={view._id}><td><div className="fw-bold">{view.student.name}</div><div className="small text-muted">{view.student.email}</div></td><td><div className="fw-semibold">{view.drive.company}</div><div className="small text-muted">{view.drive.role}</div></td><td>{view.student.department}</td><td className="fw-bold">{view.student.readinessScore} / 100</td><td>{view.viewCount}</td><td className="small">{new Date(view.lastViewedAt).toLocaleString()}</td></tr>)}
          </tbody></table>
        </div>}
      </div>

      {/* Student Roster Table */}
      <div className="glass-card p-4 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
          <h4 className="fw-bold mb-0">Student Placement Readiness Roster</h4>
          
          <div className="input-group" style={{ maxWidth: '320px' }}>
            <span className="input-group-text bg-transparent border-secondary border-opacity-25 text-muted">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control glass-card text-body form-control-sm"
              placeholder="Search by student name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-body">
            <thead>
              <tr className="text-muted small border-bottom border-secondary border-opacity-25">
                <th>Student Name</th>
                <th>Department</th>
                <th>CGPA</th>
                <th>Backlogs</th>
                <th>Readiness Score</th>
                <th>Tier Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">No student records matching criteria.</td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const score = s.readinessScore || 0;
                  const tier = score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Average' : 'Needs Improvement';
                  const tierBadge = score >= 85 ? 'bg-success' : score >= 70 ? 'bg-primary' : score >= 50 ? 'bg-warning text-dark' : 'bg-danger';

                  return (
                    <tr key={s._id}>
                      <td>
                        <div className="fw-bold">{s.userId?.name || 'Student'}</div>
                        <div className="text-muted small">{s.userId?.email}</div>
                      </td>
                      <td className="small">{s.department || 'N/A'}</td>
                      <td className="fw-bold">{s.cgpa || 0}</td>
                      <td>
                        <span className={s.backlogs > 0 ? 'text-danger fw-bold' : 'text-success'}>
                          {s.backlogs || 0}
                        </span>
                      </td>
                      <td className="fw-bold fs-6">{score} / 100</td>
                      <td>
                        <span className={`badge rounded-pill ${tierBadge}`}>{tier}</span>
                      </td>
                      <td className="text-end">
                        <Link to={`/officer/students/${s.userId?._id}`} className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 rounded-3">
                          <FaEye size={12} /> Inspect
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;
