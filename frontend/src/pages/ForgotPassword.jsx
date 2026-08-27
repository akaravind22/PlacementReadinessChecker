import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import ToastAlert from '../components/ToastAlert';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });
    setLoading(true);

    try {
      const res = await API.post('/auth/forgot-password', { email, newPassword });
      setMsg({ text: res.data.message, type: 'success' });
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Password reset failed.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="glass-card p-4 p-md-5">
            <h3 className="fw-bold text-center mb-2">Reset Password</h3>
            <p className="text-muted small text-center mb-4">Enter registered email and your new password</p>

            {msg.text && <ToastAlert message={msg.text} type={msg.type} onClose={() => setMsg({ text: '', type: '' })} />}

            <form onSubmit={handleReset}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address</label>
                <input
                  type="email"
                  className="form-control glass-card text-body"
                  required
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">New Password</label>
                <input
                  type="password"
                  className="form-control glass-card text-body"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-brand w-100 py-2.5 mb-3" disabled={loading}>
                {loading ? 'Resetting...' : 'Update Password'}
              </button>

              <div className="text-center">
                <Link to="/login" className="small fw-bold text-primary text-decoration-none">
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
