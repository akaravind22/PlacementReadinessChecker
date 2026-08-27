import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import DashboardCard from '../components/DashboardCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaUsers, FaBuilding, FaBook, FaChartBar, FaPlusCircle, FaSearch, FaEye } from 'react-icons/fa';

const OfficerDashboard = () => {
  const [students, setStudents] = useState([]);
  const [drives, setDrives] = useState([]);
  const [resources, setResources] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOfficerData = async () => {
      try {
        const [stuRes, drvRes, resRes, repRes] = await Promise.all([
          API.get('/officer/students'),
          API.get('/drives'),
          API.get('/resources'),
          API.get('/officer/reports')
        ]);
        setStudents(stuRes.data.students || []);
        setDrives(drvRes.data.drives || []);
        setResources(resRes.data.resources || []);
        setReports(repRes.data.reports || []);
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
