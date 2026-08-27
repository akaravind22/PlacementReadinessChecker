import React from 'react';

const About = () => {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-extrabold display-5">About Placement Readiness Checker</h1>
        <p className="text-muted lead">Software Architecture & Scoring Methodology</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-8 mx-auto">
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
  );
};

export default About;
