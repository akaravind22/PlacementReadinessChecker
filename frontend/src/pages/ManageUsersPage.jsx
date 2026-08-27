import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ToastAlert from '../components/ToastAlert';
import { FaUsers, FaSearch, FaTrashAlt } from 'react-icons/fa';

const ManageUsersPage = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.put(`/admin/users/${userId}/role`, { role: newRole });
      setMsg({ text: 'User role updated!', type: 'success' });
      fetchUsers();
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to update role.', type: 'danger' });
    }
  };

  const handleDeleteUser = async (userId, email) => {
    if (!window.confirm(`Are you sure you want to delete user ${email}?`)) return;

    try {
      await API.delete(`/admin/users/${userId}`);
      setMsg({ text: `User ${email} deleted successfully.`, type: 'info' });
      fetchUsers();
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to delete user.', type: 'danger' });
    }
  };

  if (loading) return <LoadingSpinner message="Fetching User Directory..." />;

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="p-3 rounded-circle bg-primary-subtle text-primary">
          <FaUsers size={24} />
        </div>
        <div>
          <h2 className="fw-bold mb-0">System User Management</h2>
          <p className="text-muted small mb-0">Grant or modify roles (Student, Placement Officer, Admin) and delete accounts</p>
        </div>
      </div>

      <ToastAlert message={msg.text} type={msg.type} onClose={() => setMsg({ text: '', type: '' })} />

      <div className="glass-card p-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
          <h5 className="fw-bold mb-0">All Registered Accounts ({filteredUsers.length})</h5>

          <div className="input-group" style={{ maxWidth: '320px' }}>
            <span className="input-group-text bg-transparent border-secondary border-opacity-25 text-muted">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control glass-card text-body form-control-sm"
              placeholder="Search user by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-body">
            <thead>
              <tr className="text-muted small border-bottom border-secondary border-opacity-25">
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Current Role</th>
                <th>Role Assignment</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id}>
                    <td className="fw-bold">{u.name}</td>
                    <td>{u.email}</td>
                    <td className="small">{u.phone || 'N/A'}</td>
                    <td>
                      <span className={`badge ${u.role === 'Admin' ? 'bg-danger' : u.role === 'Placement Officer' ? 'bg-warning text-dark' : 'bg-primary'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-select form-select-sm glass-card text-body"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        disabled={u._id === currentUser?.id}
                        style={{ maxWidth: '160px' }}
                      >
                        <option value="Student">Student</option>
                        <option value="Placement Officer">Placement Officer</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td className="text-end">
                      {u._id !== currentUser?.id && (
                        <button
                          onClick={() => handleDeleteUser(u._id, u.email)}
                          className="btn btn-sm btn-outline-danger border-0 rounded-circle"
                          title="Delete User"
                        >
                          <FaTrashAlt size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsersPage;
