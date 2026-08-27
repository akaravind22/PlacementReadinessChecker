import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import DashboardCard from '../components/DashboardCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  FaShieldAlt, FaUsers, FaUserGraduate, FaUserTie, 
  FaQuestionCircle, FaBuilding, FaBook, FaChartPie 
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await API.get('/admin/dashboard-stats');
        setStats(res.data.stats);
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
