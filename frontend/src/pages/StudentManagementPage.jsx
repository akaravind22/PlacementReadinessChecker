import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaUsers, FaSearch, FaFilter, FaEye } from 'react-icons/fa';

const StudentManagementPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [minCgpa, setMinCgpa] = useState('');
  const [minScore, setMinScore] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (minCgpa) params.minCgpa = minCgpa;
      if (minScore) params.minScore = minScore;

      const res = await API.get('/officer/students', { params });
      setStudents(res.data.students || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="p-3 rounded-circle bg-primary-subtle text-primary">
          <FaUsers size={24} />
        </div>
        <div>
          <h2 className="fw-bold mb-0">Student Directory & Search</h2>
          <p className="text-muted small mb-0">Filter candidates by CGPA, Placement Readiness Index, and department</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card p-4 mb-4">
        <form onSubmit={handleFilterSubmit} className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label small fw-semibold">Search Name or Email</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-secondary border-opacity-25 text-muted">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control glass-card text-body"
                placeholder="Aarav / aarav@example.com"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-3">
            <label className="form-label small fw-semibold">Minimum CGPA</label>
            <input
              type="number"
              step="0.1"
              className="form-control glass-card text-body"
              placeholder="e.g. 7.5"
              value={minCgpa}
              onChange={(e) => setMinCgpa(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label small fw-semibold">Min Readiness Score (0-100)</label>
            <input
              type="number"
              className="form-control glass-card text-body"
              placeholder="e.g. 70"
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <button type="submit" className="btn btn-brand w-100 py-2 d-flex align-items-center justify-content-center gap-1">
              <FaFilter size={14} /> Filter
            </button>
          </div>
        </form>
      </div>

      {/* Roster Table */}
      {loading ? (
        <LoadingSpinner message="Filtering Students..." />
      ) : (
        <div className="glass-card p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-body">
              <thead>
                <tr className="text-muted small border-bottom border-secondary border-opacity-25">
                  <th>Student Name</th>
                  <th>College & Department</th>
                  <th>CGPA</th>
                  <th>Backlogs</th>
                  <th>Readiness Score</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">No matching students found.</td>
                  </tr>
                ) : (
                  students.map((s) => (
                    <tr key={s._id}>
                      <td>
                        <div className="fw-bold">{s.userId?.name || 'Student'}</div>
                        <div className="text-muted small">{s.userId?.email}</div>
                      </td>
                      <td className="small">
                        {s.college || 'N/A'} <br />
                        <span className="text-muted">{s.department}</span>
                      </td>
                      <td className="fw-bold">{s.cgpa}</td>
                      <td className={s.backlogs > 0 ? 'text-danger fw-bold' : 'text-success'}>
                        {s.backlogs}
                      </td>
                      <td className="fw-bold fs-6">{s.readinessScore || 0} / 100</td>
                      <td className="text-end">
                        <Link to={`/officer/students/${s.userId?._id}`} className="btn btn-sm btn-outline-primary rounded-3">
                          <FaEye size={12} className="me-1" /> View Full Profile
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagementPage;
