import React from 'react';
import { FaGithub, FaExternalLinkAlt, FaTrashAlt, FaFolder } from 'react-icons/fa';

const ProjectCard = ({ project, onDelete }) => {
  return (
    <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="d-flex align-items-center gap-2">
            <FaFolder className="text-primary" size={20} />
            <h5 className="mb-0 fw-bold">{project.title}</h5>
          </div>
          {onDelete && (
            <button 
              onClick={() => onDelete(project._id)}
              className="btn btn-sm btn-outline-danger border-0 rounded-circle"
              title="Delete Project"
            >
              <FaTrashAlt size={14} />
            </button>
          )}
        </div>

        <p className="text-muted small mb-3">{project.description || 'No description provided.'}</p>
        
        {project.technology && (
          <div className="mb-3">
            <span className="badge bg-secondary-subtle text-body border border-secondary-subtle rounded-2">
              {project.technology}
            </span>
          </div>
        )}
      </div>

      <div className="d-flex align-items-center gap-2 pt-2 border-top border-secondary border-opacity-10">
        {project.githubLink && (
          <a 
            href={project.githubLink} 
            target="_blank" 
            rel="noreferrer" 
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 rounded-3"
          >
            <FaGithub size={14} /> GitHub
          </a>
        )}
        {project.liveLink && (
          <a 
            href={project.liveLink} 
            target="_blank" 
            rel="noreferrer" 
            className="btn btn-sm btn-brand d-flex align-items-center gap-1 rounded-3"
          >
            <FaExternalLinkAlt size={12} /> Live Demo
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
