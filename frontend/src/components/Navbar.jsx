import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { FaSignOutAlt, FaUserCircle, FaCog } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { t } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'Admin') return '/admin-dashboard';
    if (user.role === 'Placement Officer') return '/officer-dashboard';
    return '/student-dashboard';
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top glass-card py-2 px-3 border-0 rounded-0" style={{ background: 'var(--bg-nav)' }}>
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to={getDashboardLink()}>
          <div className="d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
            <img src="/logo.gif" alt="Placement logo" style={{ width: 36, height: 36, objectFit: 'contain' }} />
          </div>
          <span className="fs-5 gradient-text">PlacementChecker</span>
        </Link>

        <button 
          className="navbar-toggler border-0 text-white" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-center gap-2 ms-lg-4">
            {!user ? (
              <>
                <li className="nav-item"><a className="nav-link text-body fw-medium" href="/#home">{t('Home')}</a></li>
                <li className="nav-item"><a className="nav-link text-body fw-medium" href="/#about">{t('About')}</a></li>
                <li className="nav-item"><a className="nav-link text-body fw-medium" href="/#contact">{t('Contact')}</a></li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link text-body fw-semibold" to={getDashboardLink()}>
                  {t('Dashboard')}
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            <Link to="/settings" className="btn btn-sm btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center" title={t('Settings')} style={{ width: '38px', height: '38px' }}>
              <FaCog size={16} />
            </Link>

            {user ? (
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-2">
                  <FaUserCircle size={28} className="text-primary" />
                  <div className="d-none d-sm-block text-start" style={{ lineHeight: '1.2' }}>
                    <div className="fw-semibold text-truncate" style={{ maxWidth: '140px' }}>{user.name}</div>
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill" style={{ fontSize: '0.65rem' }}>
                      {user.role}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 rounded-3 px-3 py-2"
                >
                  <FaSignOutAlt size={14} />
                  <span className="d-none d-md-inline">{t('Logout')}</span>
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-brand btn-sm">{t('Login')}</Link>
                <Link to="/register" className="btn btn-brand btn-sm">{t('Register')}</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
