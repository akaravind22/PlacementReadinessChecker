import React from 'react';
import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaTrashAlt } from 'react-icons/fa';

const PlacementDriveCard = ({ drive, onDelete, isManage = false }) => {
  return (
    <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
      <div>
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <FaBuilding className="text-primary" size={18} />
              <h5 className="fw-bold mb-0">{drive.company}</h5>
            </div>
            <span className="text-muted small fw-medium">{drive.role}</span>
          </div>

          <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-bold">
            <FaMoneyBillWave size={12} className="me-1" /> {drive.package}
          </span>
        </div>

        <p className="text-muted small mb-3">{drive.description}</p>

        <div className="d-flex flex-wrap gap-2 mb-3">
          <div className="badge bg-secondary-subtle text-body small font-normal">
            <strong>Eligibility:</strong> {drive.eligibility}
          </div>
          <div className="badge bg-secondary-subtle text-body small font-normal d-flex align-items-center gap-1">
            <FaMapMarkerAlt size={12} /> {drive.location}
          </div>
        </div>
      </div>

      <div>
        <div className="d-flex align-items-center justify-content-between pt-3 border-top border-secondary border-opacity-10">
          <span className="text-danger small fw-semibold d-flex align-items-center gap-1">
            <FaCalendarAlt size={13} /> Deadline: {drive.deadline}
          </span>

          {isManage && onDelete ? (
            <button onClick={() => onDelete(drive._id)} className="btn btn-sm btn-outline-danger rounded-3">
              <FaTrashAlt size={13} /> Delete
            </button>
          ) : (
            <a 
              href={drive.applyLink || '#'} 
              target="_blank" 
              rel="noreferrer" 
              className={`btn btn-sm btn-brand rounded-3 ${!drive.applyLink ? 'disabled' : ''}`}
            >
              Apply Now
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlacementDriveCard;
