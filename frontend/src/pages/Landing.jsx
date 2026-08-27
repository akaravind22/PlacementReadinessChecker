import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaChartLine, FaRocket, FaShieldAlt, FaBookOpen, FaUserCheck } from 'react-icons/fa';
import { SettingsContext } from '../context/SettingsContext';

const Landing = () => {
  const { t } = useContext(SettingsContext);
  return (
    <div>
      {/* Hero Section */}
      <section id="home" className="py-5 text-center position-relative overflow-hidden">
        <div className="container py-5">
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold mb-3">
            <FaRocket className="me-1" /> {t('Campus Recruitment Portal')}
          </span>
          <h1 className="display-4 fw-extrabold mb-3">
            {t('Assess & Accelerate Your')} <br />
            <span className="gradient-text">{t('Placement Readiness Score')}</span>
          </h1>
          <p className="lead text-muted mx-auto mb-5" style={{ maxWidth: '680px' }}>
            {t('Empower your college career with data-driven insights. Calculate your real-time Placement Readiness Index based on academics, coding skills, projects, certifications, internships, and technical quizzes.')}
          </p>

          <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
            <Link to="/register" className="btn btn-brand btn-lg rounded-3 px-4 py-3">
              {t('Get Started')}
            </Link>
            <Link to="/login" className="btn btn-outline-brand btn-lg rounded-3 px-4 py-3">
              {t('Sign In to Portal')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">{t('Platform Capabilities')}</h2>
            <p className="text-muted">{t('Designed for Students, Placement Officers, and Campus Administrators')}</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="glass-card p-4 h-100">
                <div className="p-3 rounded-4 bg-primary-subtle text-primary d-inline-block mb-3">
                  <FaChartLine size={28} />
                </div>
                <h4 className="fw-bold">{t('Smart Score Engine')}</h4>
                <p className="text-muted small">
                  Weighted 100-point algorithm evaluating CGPA (20%), Technical Skills (20%), Projects (20%), Certifications (15%), Internships (10%), and Quizzes (15%).
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="glass-card p-4 h-100">
                <div className="p-3 rounded-4 bg-success-subtle text-success d-inline-block mb-3">
                  <FaUserCheck size={28} />
                </div>
                <h4 className="fw-bold">{t('Personalized Feedback')}</h4>
                <p className="text-muted small">
                  Receive instant automated suggestions pointing out weak academic or technical areas to ensure top-tier company eligibility.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="glass-card p-4 h-100">
                <div className="p-3 rounded-4 bg-info-subtle text-info d-inline-block mb-3">
                  <FaBookOpen size={28} />
                </div>
                <h4 className="fw-bold">{t('Drives & Learning Portal')}</h4>
                <p className="text-muted small">
                  Stay ahead with live campus placement drives, company package information, eligibility criteria, and officer-curated study material.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">About Placement Readiness Checker</h2>
            <p className="text-muted">Software Architecture & Scoring Methodology</p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="glass-card p-4 p-md-5">
                <h3 className="fw-bold mb-3 gradient-text">Scoring Breakdown & Weighted Formula</h3>
                <p className="text-body mb-4">
                  Our Placement Readiness Score synthesizes student profile metrics into a standardized 100-point index designed in alignment with campus placement requirements:
                </p>

                <ul className="list-group list-group-flush bg-transparent mb-4">
                  <li className="list-group-item bg-transparent text-body d-flex justify-content-between">
                    <span><strong>Academic CGPA & Backlog History:</strong></span>
                    <span className="badge bg-primary">20% Weight</span>
                  </li>
                  <li className="list-group-item bg-transparent text-body d-flex justify-content-between">
                    <span><strong>Verified Technical Skills:</strong></span>
                    <span className="badge bg-primary">20% Weight</span>
                  </li>
                  <li className="list-group-item bg-transparent text-body d-flex justify-content-between">
                    <span><strong>Projects & Code Repository Quality:</strong></span>
                    <span className="badge bg-primary">20% Weight</span>
                  </li>
                  <li className="list-group-item bg-transparent text-body d-flex justify-content-between">
                    <span><strong>Industry Certifications:</strong></span>
                    <span className="badge bg-primary">15% Weight</span>
                  </li>
                  <li className="list-group-item bg-transparent text-body d-flex justify-content-between">
                    <span><strong>Internship & Industry Experience:</strong></span>
                    <span className="badge bg-primary">10% Weight</span>
                  </li>
                  <li className="list-group-item bg-transparent text-body d-flex justify-content-between">
                    <span><strong>Aptitude & Technical Quiz Performance:</strong></span>
                    <span className="badge bg-primary">15% Weight</span>
                  </li>
                </ul>

                <h4 className="fw-bold mb-3">Readiness Tiers</h4>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge bg-success-subtle text-success p-2">85 - 100: Excellent (Tier 1 Ready)</span>
                  <span className="badge bg-primary-subtle text-primary p-2">70 - 84: Good (Core Companies)</span>
                  <span className="badge bg-warning-subtle text-warning p-2">50 - 69: Average (Needs Practice)</span>
                  <span className="badge bg-danger-subtle text-danger p-2">&lt; 50: Needs Improvement</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="glass-card p-4 p-md-5">
                <h2 className="fw-bold mb-2">Contact Placement Cell</h2>
                <p className="text-muted small mb-4">Have questions regarding placement drives, student profiles, or portal assistance?</p>

                <form>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Your Name</label>
                    <input type="text" className="form-control glass-card text-body" required placeholder="John Doe" />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Email Address</label>
                    <input type="email" className="form-control glass-card text-body" required placeholder="student@college.edu" />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Message / Query</label>
                    <textarea className="form-control glass-card text-body" rows="4" required placeholder="Type your query regarding placement drives or profile verification..."></textarea>
                  </div>

                  <button type="submit" className="btn btn-brand w-100 py-2">
                    Submit Inquiry
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
