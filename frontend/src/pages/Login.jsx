import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ToastAlert from '../components/ToastAlert';
import { FaLock, FaEnvelope, FaGraduationCap } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'Admin') navigate('/admin-dashboard');
      else if (loggedUser.role === 'Placement Officer') navigate('/officer-dashboard');
      else navigate('/student-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="glass-card p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="p-3 rounded-circle bg-primary-subtle text-primary d-inline-block mb-3">
                <FaGraduationCap size={32} />
              </div>
              <h3 className="fw-bold">Welcome Back</h3>
              <p className="text-muted small">Sign in to Placement Readiness Checker</p>
            </div>

            <ToastAlert message={error} onClose={() => setError('')} />

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-secondary border-opacity-25 text-muted">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    className="form-control glass-card text-body"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-semibold mb-0">Password</label>
                  <Link to="/forgot-password" className="small text-primary text-decoration-none">
                    Forgot Password?
                  </Link>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-secondary border-opacity-25 text-muted">
                    <FaLock />
                  </span>
                  <input
                    type="password"
                    className="form-control glass-card text-body"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-brand w-100 py-2.5 mb-3" disabled={loading}>
                {loading ? 'Authenticating...' : 'Login to Account'}
              </button>

              <div className="text-center">
                <span className="text-muted small">Don't have an account? </span>
                <Link to="/register" className="small fw-bold text-primary text-decoration-none">
                  Register Now
                </Link>
              </div>
            </form>

            <div className="mt-4 pt-3 border-top border-secondary border-opacity-10 text-center">
              <span className="text-muted small d-block mb-2">Demo Quick Accounts:</span>
              <div className="d-flex flex-wrap justify-content-center gap-1">
                <button onClick={() => { setEmail('student@example.com'); setPassword('password123'); }} className="btn btn-sm btn-outline-secondary py-1 px-2" style={{ fontSize: '0.7rem' }}>Student Demo</button>
                <button onClick={() => { setEmail('officer@example.com'); setPassword('password123'); }} className="btn btn-sm btn-outline-secondary py-1 px-2" style={{ fontSize: '0.7rem' }}>Officer Demo</button>
                <button onClick={() => { setEmail('admin@example.com'); setPassword('password123'); }} className="btn btn-sm btn-outline-secondary py-1 px-2" style={{ fontSize: '0.7rem' }}>Admin Demo</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
