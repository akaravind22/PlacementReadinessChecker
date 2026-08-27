import React, { useEffect, useState } from 'react';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaClipboardList, FaCheckCircle, FaTimesCircle, FaGraduationCap, FaProjectDiagram, FaCertificate, FaBriefcase, FaStar } from 'react-icons/fa';

const StudentReportPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await API.get('/student/report');
        setReport(res.data.report);
      } catch (err) {
        console.error('Failed to load report:', err);
        setError('Unable to fetch your placement report. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) return <LoadingSpinner message="Loading your placement report..." />;

  if (error) {
    return (
      <div className="container py-4">
        <div className="glass-card p-4 text-center text-danger">
          <h3 className="fw-bold">Report Error</h3>
          <p className="mb-0">{error}</p>
        </div>
      </div>
    );
  }

  const { user, profile, metrics, scoreData, skills, projects, certifications, internships, quizResults } = report;

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-2">My Placement Report</h2>
          <p className="text-muted mb-0">A personalized progress report for your placement readiness and employability profile.</p>
        </div>
        <div className="text-md-end">
          <div className="badge bg-success rounded-pill py-2 px-3 mb-2">{metrics.eligibilityStatus}</div>
          <div className="text-muted small">Report generated on {new Date(metrics.reportDate).toLocaleDateString()}</div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <div className="glass-card p-4 h-100">
            <h5 className="fw-bold mb-3">Overview</h5>
            <div className="d-flex align-items-center gap-2 mb-3">
              <FaGraduationCap className="text-primary" />
              <div>
                <div className="text-muted small">Academic Score</div>
                <div className="fw-bold">{profile?.cgpa ?? 'N/A'} / 10</div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 mb-3">
              <FaProjectDiagram className="text-success" />
              <div>
                <div className="text-muted small">Projects</div>
                <div className="fw-bold">{metrics.totalProjects}</div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 mb-3">
              <FaCertificate className="text-warning" />
              <div>
                <div className="text-muted small">Certifications</div>
                <div className="fw-bold">{metrics.totalCertifications}</div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 mb-3">
              <FaBriefcase className="text-info" />
              <div>
                <div className="text-muted small">Internships</div>
                <div className="fw-bold">{metrics.totalInternships}</div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              {profile?.resume ? (
                <><FaCheckCircle className="text-success" /><span className="fw-semibold">Resume Uploaded</span></>
              ) : (
                <><FaTimesCircle className="text-danger" /><span className="fw-semibold">Resume Missing</span></>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="glass-card p-4 h-100">
            <h5 className="fw-bold mb-3">Readiness Score</h5>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div>
                <div className="text-muted small">Overall Score</div>
                <div className="display-6 fw-bold">{scoreData.totalScore}</div>
              </div>
              <div className="text-end">
                <div className="text-muted small">Performance Category</div>
                <div className="fw-bold">{scoreData.category}</div>
              </div>
            </div>

            <div className="row g-3 mt-4">
              {Object.entries(scoreData.breakdown).map(([key, value]) => (
                <div key={key} className="col-6">
                  <div className="p-3 rounded-3 bg-secondary-subtle">
                    <div className="text-muted small text-capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                    <div className="fw-bold">{value} / {key === 'cgpaScore' ? 20 : key === 'skillScore' ? 20 : key === 'projectScore' ? 20 : key === 'certScore' ? 15 : key === 'internshipScore' ? 10 : 15}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-4 mb-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <FaClipboardList className="text-primary" />
          <h5 className="fw-bold mb-0">How Your Readiness Score Is Calculated</h5>
        </div>
        <p className="text-muted small mb-3">The system calculates your score automatically from your profile and quiz performance. Maximum total: 100 points.</p>
        <div className="row g-3 readiness-formula-grid">
          <div className="col-md-6 col-lg-4"><div className="readiness-formula"><strong>CGPA & Backlogs · 20 points</strong><span>(CGPA ÷ 10 × 20) − 2 points for each backlog</span></div></div>
          <div className="col-md-6 col-lg-4"><div className="readiness-formula"><strong>Technical Skills · 20 points</strong><span>Beginner: 2, Intermediate: 3, Advanced: 4, Expert: 5 points per skill</span></div></div>
          <div className="col-md-6 col-lg-4"><div className="readiness-formula"><strong>Projects · 20 points</strong><span>7 points per project + 1 for GitHub link + 1 for live demo</span></div></div>
          <div className="col-md-6 col-lg-4"><div className="readiness-formula"><strong>Certifications · 15 points</strong><span>5 points per certification</span></div></div>
          <div className="col-md-6 col-lg-4"><div className="readiness-formula"><strong>Internships · 10 points</strong><span>5 points per internship</span></div></div>
          <div className="col-md-6 col-lg-4"><div className="readiness-formula"><strong>Quiz Results · 15 points</strong><span>Average quiz percentage ÷ 100 × 15</span></div></div>
        </div>
      </div>

      <div className="row g-4 report-section-row">
        <div className="col-lg-6">
          <div className="glass-card p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-3">
              <FaStar className="text-warning" />
              <h5 className="fw-bold mb-0">Top Skills</h5>
            </div>
            {metrics.topSkills.length > 0 ? (
              <div className="d-flex flex-wrap gap-2">
                {metrics.topSkills.map((skill, idx) => (
                  <span key={idx} className="badge bg-primary-subtle text-primary py-2 px-3">{skill}</span>
                ))}
              </div>
            ) : (
              <p className="text-muted small mb-0">Add more technical skills to build a stronger profile.</p>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="glass-card p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-3">
              <FaClipboardList className="text-primary" />
              <h5 className="fw-bold mb-0">Preparation Summary</h5>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                <span>Skills Count</span>
                <strong>{metrics.totalSkills}</strong>
              </li>
              <li className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                <span>Average Quiz Score</span>
                <strong>{metrics.averageQuizScore}%</strong>
              </li>
              <li className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                <span>Resume Status</span>
                <strong>{profile?.resume ? 'Uploaded' : 'Missing'}</strong>
              </li>
              <li className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                <span>Eligibility</span>
                <strong>{metrics.eligibilityStatus}</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-4 report-section-row">
        <div className="col-lg-6">
          <div className="glass-card p-4 h-100">
            <h5 className="fw-bold mb-3">Recent Projects</h5>
            {projects.length === 0 ? (
              <p className="text-muted small">Add projects to demonstrate hands-on experience.</p>
            ) : (
              projects.slice(0, 4).map((project) => (
                <div key={project._id} className="mb-3 pb-3 border-bottom border-secondary border-opacity-10">
                  <div className="fw-semibold">{project.title}</div>
                  <div className="text-muted small">{project.technology || 'No technology listed'}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="glass-card p-4 h-100">
            <h5 className="fw-bold mb-3">Recent Quiz Results</h5>
            {quizResults.length === 0 ? (
              <p className="text-muted small">Complete quizzes to show your readiness progress.</p>
            ) : (
              quizResults.slice(0, 5).map((quiz) => (
                <div key={quiz._id} className="mb-3 pb-3 border-bottom border-secondary border-opacity-10">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-semibold">{quiz.quizTitle || 'Practice Quiz'}</span>
                    <span className="badge bg-secondary-subtle text-secondary">{quiz.score}%</span>
                  </div>
                  <div className="text-muted small">Taken on {new Date(quiz.createdAt).toLocaleDateString()}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentReportPage;
