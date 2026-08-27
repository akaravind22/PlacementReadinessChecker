import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ToastAlert from '../components/ToastAlert';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student',
    phone: '',
    college: '',
    department: 'Computer Science & Engineering',
    year: '4th Year',
    cgpa: '7.5'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const newUser = await register(formData);
      if (newUser.role === 'Admin') navigate('/admin-dashboard');
      else if (newUser.role === 'Placement Officer') navigate('/officer-dashboard');
      else navigate('/student-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="glass-card p-4 p-md-5">
            <h3 className="fw-bold text-center mb-1">Create Account</h3>
            <p className="text-muted small text-center mb-4">Register for Placement Readiness Checker Portal</p>

            <ToastAlert message={error} onClose={() => setError('')} />

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control glass-card text-body"
                    required
                    placeholder="Aarav Patel"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control glass-card text-body"
                    required
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Password *</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control glass-card text-body"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">User Role *</label>
                  <select
                    name="role"
                    className="form-select glass-card text-body"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="Student">Student</option>
                    <option value="Placement Officer">Placement Officer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                {formData.role === 'Student' && (
                  <>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">College / University</label>
                      <input
                        type="text"
                        name="college"
                        className="form-control glass-card text-body"
                        placeholder="National Institute of Tech"
                        value={formData.college}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Department</label>
                      <input
                        type="text"
                        name="department"
                        className="form-control glass-card text-body"
                        placeholder="Computer Science & Engg"
                        value={formData.department}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Academic CGPA (0 - 10)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        name="cgpa"
                        className="form-control glass-card text-body"
                        value={formData.cgpa}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Year of Study</label>
                      <select
                        name="year"
                        className="form-select glass-card text-body"
                        value={formData.year}
                        onChange={handleChange}
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              <button type="submit" className="btn btn-brand w-100 py-2.5 mt-4 mb-3" disabled={loading}>
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>

              <div className="text-center">
                <span className="text-muted small">Already registered? </span>
                <Link to="/login" className="small fw-bold text-primary text-decoration-none">
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
