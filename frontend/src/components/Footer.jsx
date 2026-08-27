import React from 'react';
import { FaGraduationCap, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-4 border-top border-secondary border-opacity-10 glass-card rounded-0">
      <div className="container text-center text-md-between d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-2">
          <FaGraduationCap className="text-primary" size={20} />
          <span className="fw-semibold text-body">Placement Readiness Checker</span>
          <span className="text-muted small">© {new Date().getFullYear()}</span>
        </div>
        <div className="text-muted small">
          Engineered for excellence in campus placement readiness & student career growth.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
