import React, { useState, useEffect } from 'react';
import API from '../services/api';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ToastAlert from '../components/ToastAlert';
import { FaFolderOpen, FaPlus } from 'react-icons/fa';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technology: '',
    githubLink: '',
    liveLink: ''
  });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchProjects = async () => {
    try {
      const res = await API.get('/student/projects');
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      await API.post('/student/projects', formData);
      setFormData({ title: '', description: '', technology: '', githubLink: '', liveLink: '' });
      setMsg({ text: 'Project added successfully!', type: 'success' });
      fetchProjects();
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to add project.', type: 'danger' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/student/projects/${id}`);
      setMsg({ text: 'Project removed.', type: 'info' });
      fetchProjects();
    } catch (err) {
      setMsg({ text: 'Failed to delete project.', type: 'danger' });
    }
  };

  if (loading) return <LoadingSpinner message="Loading Projects Portfolio..." />;

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="p-3 rounded-circle bg-success-subtle text-success">
          <FaFolderOpen size={24} />
        </div>
        <div>
          <h2 className="fw-bold mb-0">Projects Portfolio</h2>
          <p className="text-muted small mb-0">Highlight full-stack and domain-specific software projects with source code links</p>
        </div>
      </div>

      <ToastAlert message={msg.text} type={msg.type} onClose={() => setMsg({ text: '', type: '' })} />

      <div className="row g-4">
        {/* Add Project Form */}
        <div className="col-lg-5">
          <div className="glass-card p-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <FaPlus size={16} /> Add New Project
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Project Title *</label>
                <input
                  type="text"
                  className="form-control glass-card text-body"
                  placeholder="Placement Readiness Checker App"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Description</label>
                <textarea
                  className="form-control glass-card text-body"
                  rows="3"
                  placeholder="Key features and technical problem solved..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Technologies Used</label>
                <input
                  type="text"
                  className="form-control glass-card text-body"
                  placeholder="React, Node.js, Express, MongoDB"
                  value={formData.technology}
                  onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">GitHub Repository Link</label>
                <input
                  type="url"
                  className="form-control glass-card text-body"
                  placeholder="https://github.com/username/project"
                  value={formData.githubLink}
                  onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Live Demo Link</label>
                <input
                  type="url"
                  className="form-control glass-card text-body"
                  placeholder="https://myproject.demo.app"
                  value={formData.liveLink}
                  onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-brand w-100 py-2">
                Add Project to Portfolio
              </button>
            </form>
          </div>
        </div>

        {/* Projects List */}
        <div className="col-lg-7">
          <div className="row g-3">
            {projects.length === 0 ? (
              <div className="col-12">
                <div className="glass-card p-4 text-center text-muted">
                  No projects added yet. Adding 2+ projects grants up to 20 score points!
                </div>
              </div>
            ) : (
              projects.map((proj) => (
                <div key={proj._id} className="col-12">
                  <ProjectCard project={proj} onDelete={handleDelete} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
