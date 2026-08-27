import React from 'react';
import { FaCode, FaTrashAlt } from 'react-icons/fa';

const SkillCard = ({ skill, onDelete }) => {
  const getBadgeColor = (level) => {
    switch (level) {
      case 'Expert': return 'bg-success text-white';
      case 'Advanced': return 'bg-primary text-white';
      case 'Intermediate': return 'bg-info text-dark';
      default: return 'bg-secondary text-white';
    }
  };

  return (
    <div className="glass-card p-3 d-flex align-items-center justify-content-between mb-3">
      <div className="d-flex align-items-center gap-3">
        <div className="p-2 rounded-3 bg-primary-subtle text-primary">
          <FaCode size={20} />
        </div>
        <div>
          <h6 className="mb-0 fw-bold">{skill.skillName}</h6>
          <span className={`badge rounded-pill mt-1 ${getBadgeColor(skill.level)}`}>
            {skill.level}
          </span>
        </div>
      </div>

      {onDelete && (
        <button 
          onClick={() => onDelete(skill._id)} 
          className="btn btn-sm btn-outline-danger border-0 rounded-circle"
          title="Delete Skill"
        >
          <FaTrashAlt size={14} />
        </button>
      )}
    </div>
  );
};

export default SkillCard;
