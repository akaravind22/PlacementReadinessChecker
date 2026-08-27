import React, { useState, useEffect } from 'react';
import API from '../services/api';
import ResourceCard from '../components/ResourceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaBook } from 'react-icons/fa';

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await API.get('/resources');
        setResources(res.data.resources || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  if (loading) return <LoadingSpinner message="Loading Placement Study Resources..." />;

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="p-3 rounded-circle bg-info-subtle text-info">
          <FaBook size={24} />
        </div>
        <div>
          <h2 className="fw-bold mb-0">Placement Learning Resources</h2>
          <p className="text-muted small mb-0">Officer-curated PDFs, video crash courses, aptitude guides, and study materials</p>
        </div>
      </div>

      <div className="row g-4">
        {resources.length === 0 ? (
          <div className="col-12">
            <div className="glass-card p-5 text-center text-muted">
              No learning resources uploaded yet.
            </div>
          </div>
        ) : (
          resources.map((res) => (
            <div key={res._id} className="col-md-6 col-lg-4">
              <ResourceCard resource={res} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;
