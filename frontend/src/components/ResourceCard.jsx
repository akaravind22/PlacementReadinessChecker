import React from 'react';
import { FaFilePdf, FaVideo, FaNewspaper, FaExternalLinkAlt, FaTrashAlt } from 'react-icons/fa';

const ResourceCard = ({ resource, onDelete, isManage = false }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'PDF': return <FaFilePdf className="text-danger" size={24} />;
      case 'Video': return <FaVideo className="text-primary" size={24} />;
      default: return <FaNewspaper className="text-success" size={24} />;
    }
  };

  return (
    <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-3">
            <div className="p-2 rounded-3 bg-secondary-subtle">
              {getIcon(resource.type)}
            </div>
            <div>
              <span className="badge bg-secondary-subtle text-body border border-secondary-subtle rounded-pill">
                {resource.type}
              </span>
            </div>
          </div>

          {isManage && onDelete && (
            <button onClick={() => onDelete(resource._id)} className="btn btn-sm btn-outline-danger border-0 rounded-circle">
              <FaTrashAlt size={14} />
            </button>
          )}
        </div>

        <h5 className="fw-bold mb-2">{resource.title}</h5>
        <p className="text-muted small mb-3">{resource.description || 'Uploaded learning material for placement preparation.'}</p>
      </div>

      <div className="pt-3 border-top border-secondary border-opacity-10">
        <a 
          href={resource.url} 
          target="_blank" 
          rel="noreferrer" 
          className="btn btn-outline-brand btn-sm w-100 d-flex align-items-center justify-content-center gap-2 rounded-3"
        >
          <FaExternalLinkAlt size={12} /> Access Material
        </a>
      </div>
    </div>
  );
};

export default ResourceCard;
