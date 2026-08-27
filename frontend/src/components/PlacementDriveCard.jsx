import React, { useState } from 'react';
import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaTrashAlt, FaInfoCircle, FaTimes } from 'react-icons/fa';

const PlacementDriveCard = ({ drive, onDelete, isManage = false }) => {
  const [showInfo, setShowInfo] = useState(false);
  return (<>
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
          ) : <div className="d-flex align-items-center gap-2">
            <button type="button" onClick={() => setShowInfo(true)} className="btn btn-sm btn-outline-brand rounded-3 d-flex align-items-center gap-1"><FaInfoCircle /> Company Info</button>
            <a href={drive.applyLink || '#'} target="_blank" rel="noreferrer" className={`btn btn-sm btn-brand rounded-3 ${!drive.applyLink ? 'disabled' : ''}`}>Apply Now</a>
          </div>}
        </div>
      </div>
    </div>
    {showInfo && <div className="company-info-backdrop" role="presentation" onMouseDown={() => setShowInfo(false)}>
      <div className="company-info-modal glass-card" role="dialog" aria-modal="true" aria-labelledby={`company-info-${drive._id}`} onMouseDown={(event) => event.stopPropagation()}>
        <div className="d-flex align-items-start justify-content-between gap-3 mb-3"><div><span className="text-primary small fw-semibold">COMPANY INFORMATION</span><h4 id={`company-info-${drive._id}`} className="fw-bold mb-0">{drive.company}</h4></div><button type="button" className="btn btn-sm btn-outline-secondary rounded-circle" onClick={() => setShowInfo(false)} aria-label="Close"><FaTimes /></button></div>
        <div className="company-info-grid mb-3"><div><span>Position</span><strong>{drive.role}</strong></div><div><span>Package</span><strong className="text-success">{drive.package}</strong></div><div><span>Location</span><strong>{drive.location}</strong></div><div><span>Application deadline</span><strong className="text-danger">{drive.deadline}</strong></div></div>
        <div className="mb-3"><span className="company-info-label">About this opportunity</span><p className="text-muted mb-0">{drive.description || 'No additional company information was provided.'}</p></div>
        <div className="mb-4"><span className="company-info-label">Eligibility</span><p className="mb-0">{drive.eligibility}</p></div>
        <div className="d-flex justify-content-end gap-2">{drive.applyLink && <a href={drive.applyLink} target="_blank" rel="noreferrer" className="btn btn-outline-brand">Visit Careers Page</a>}<button type="button" className="btn btn-brand" onClick={() => setShowInfo(false)}>Close</button></div>
      </div>
    </div>}
  </>);
};

export default PlacementDriveCard;
