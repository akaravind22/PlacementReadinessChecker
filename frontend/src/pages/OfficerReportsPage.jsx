import React, { useState, useEffect } from 'react';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ToastAlert from '../components/ToastAlert';
import { FaChartBar, FaPlusCircle } from 'react-icons/fa';

const OfficerReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchReports = async () => {
    try {
      const res = await API.get('/officer/reports');
      setReports(res.data.reports || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerateReport = async () => {
    setGenerating(true);
    setMsg({ text: '', type: '' });

    try {
      const res = await API.post('/officer/reports');
      setMsg({ text: 'Batch placement analytics report generated!', type: 'success' });
      fetchReports();
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to generate report.', type: 'danger' });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading Reports & Analytics..." />;

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className="p-3 rounded-circle bg-warning-subtle text-warning">
            <FaChartBar size={24} />
          </div>
          <div>
            <h2 className="fw-bold mb-0">Placement Batch Reports & Analytics</h2>
            <p className="text-muted small mb-0">Synthesize batch readiness statistics and company eligibility logs</p>
          </div>
        </div>

        <button 
          onClick={handleGenerateReport} 
          className="btn btn-brand rounded-3 d-flex align-items-center gap-2"
          disabled={generating}
        >
          <FaPlusCircle /> {generating ? 'Analyzing Batch...' : 'Generate New Analytics Report'}
        </button>
      </div>

      <ToastAlert message={msg.text} type={msg.type} onClose={() => setMsg({ text: '', type: '' })} />

      <div className="row g-4">
        <div className="col-12">
          <div className="glass-card p-4">
            <h5 className="fw-bold mb-3">Generated Reports Log ({reports.length})</h5>

            {reports.length === 0 ? (
              <p className="text-muted small py-3 text-center">No batch reports generated yet. Click 'Generate New Analytics Report' to create one.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {reports.map((rep) => (
                  <div key={rep._id} className="p-4 rounded-3 border border-secondary border-opacity-10 bg-body-tertiary">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h5 className="fw-bold mb-1">{rep.title}</h5>
                        <span className="text-muted small">
                          Generated on: {new Date(rep.generatedDate).toLocaleString()} • By {rep.generatedBy?.name || 'Placement Officer'}
                        </span>
                      </div>
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2">
                        Official Audit Report
                      </span>
                    </div>

                    <div className="row g-3 text-center">
                      <div className="col-md-4">
                        <div className="p-3 rounded-3 glass-card">
                          <span className="text-muted small d-block">Total Students Analyzed</span>
                          <strong className="fs-4">{rep.metrics?.totalStudents || 0}</strong>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="p-3 rounded-3 glass-card">
                          <span className="text-muted small d-block">Batch Avg Readiness Score</span>
                          <strong className="fs-4 text-primary">{rep.metrics?.avgReadinessScore || 0} / 100</strong>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="p-3 rounded-3 glass-card">
                          <span className="text-muted small d-block">Core Drive Eligible Candidates</span>
                          <strong className="fs-4 text-success">{rep.metrics?.placedEligibleCount || 0}</strong>
                        </div>
                      </div>
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

export default OfficerReportsPage;
