import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import DashboardCard from '../components/DashboardCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  FaShieldAlt, FaUsers, FaUserGraduate, FaUserTie, 
  FaQuestionCircle, FaBuilding, FaBook, FaChartPie, FaEye 
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [driveViews, setDriveViews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const [statsResponse, viewsResponse] = await Promise.all([
          API.get('/admin/dashboard-stats'),
          API.get('/officer/drive-views')
        ]);
        setStats(statsResponse.data.stats);
        setDriveViews(viewsResponse.data.views || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) return <LoadingSpinner message="Loading System Admin Statistics..." />;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">System Administration Portal</h2>
          <p className="text-muted small mb-0">Oversee users, role authorizations, quiz database, placement drives, and system metrics</p>
        </div>
      </div>

      {/* Primary Overview Metrics */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <DashboardCard title="Total Registered Users" value={stats?.totalUsers || 0} icon={FaUsers} color="primary" />
        </div>
        <div className="col-6 col-md-3">
          <DashboardCard title="Students" value={stats?.studentCount || 0} icon={FaUserGraduate} color="success" />
        </div>
        <div className="col-6 col-md-3">
          <DashboardCard title="Placement Officers" value={stats?.officerCount || 0} icon={FaUserTie} color="warning" />
        </div>
        <div className="col-6 col-md-3">
          <DashboardCard title="System Admins" value={stats?.adminCount || 0} icon={FaShieldAlt} color="danger" />
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <DashboardCard title="Practice Quizzes" value={stats?.totalQuizzes || 0} icon={FaQuestionCircle} color="info" />
        </div>
        <div className="col-6 col-md-3">
          <DashboardCard title="Placement Drives" value={stats?.totalDrives || 0} icon={FaBuilding} color="secondary" />
        </div>
        <div className="col-6 col-md-3">
          <DashboardCard title="Study Resources" value={stats?.totalResources || 0} icon={FaBook} color="primary" />
        </div>
        <div className="col-6 col-md-3">
          <DashboardCard title="Batch Avg Readiness" value={`${stats?.avgReadinessScore || 0}%`} icon={FaChartPie} color="success" />
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12">
          <div className="glass-card p-4">
            <div className="d-flex align-items-center justify-content-between mb-3"><div className="d-flex align-items-center gap-2"><FaEye className="text-primary" /><h4 className="fw-bold mb-0">Student Drive Views</h4></div><span className="badge bg-primary-subtle text-primary">{driveViews.length} Viewed</span></div>
            {driveViews.length === 0 ? <p className="text-muted mb-0">No student has opened a drive’s company information yet.</p> : <div className="table-responsive"><table className="table table-hover align-middle mb-0 text-body"><thead><tr><th>Student</th><th>Drive</th><th>Department</th><th>Views</th><th>Last Opened</th></tr></thead><tbody>
              {driveViews.map((view) => <tr key={view._id}><td><div className="fw-semibold">{view.student.name}</div><div className="small text-muted">{view.student.email}</div></td><td><div className="fw-semibold">{view.drive.company}</div><div className="small text-muted">{view.drive.role}</div></td><td>{view.student.department}</td><td>{view.viewCount}</td><td className="small">{new Date(view.lastViewedAt).toLocaleString()}</td></tr>)}
            </tbody></table></div>}

          </div>
        </div>
      </div>

      {/* Admin Operations Shortcuts Grid */}
      <h4 className="fw-bold mb-3">System Control Modules</h4>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="glass-card p-4 text-center">
            <FaUsers size={36} className="text-primary mb-3" />
            <h5 className="fw-bold">User Management</h5>
            <p className="text-muted small mb-3">Manage user accounts, assign roles, and revoke access.</p>
            <Link to="/admin/users" className="btn btn-outline-brand btn-sm rounded-3">Manage Users</Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="glass-card p-4 text-center">
            <FaQuestionCircle size={36} className="text-info mb-3" />
            <h5 className="fw-bold">Quiz Master Portal</h5>
            <p className="text-muted small mb-3">Create technical and aptitude quizzes and add questions.</p>
            <Link to="/admin/quizzes" className="btn btn-outline-brand btn-sm rounded-3">Manage Quizzes</Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="glass-card p-4 text-center">
            <FaBuilding size={36} className="text-warning mb-3" />
            <h5 className="fw-bold">Placement Drives</h5>
            <p className="text-muted small mb-3">Audit company recruitment drives and deadlines.</p>
            <Link to="/admin/drives" className="btn btn-outline-brand btn-sm rounded-3">Manage Drives</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
