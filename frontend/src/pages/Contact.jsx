import React, { useState } from 'react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="glass-card p-4 p-md-5">
            <h2 className="fw-bold mb-2">Contact Placement Cell</h2>
            <p className="text-muted small mb-4">Have questions regarding placement drives, student profiles, or portal technical assistance?</p>

            {submitted ? (
              <div className="alert alert-success rounded-3 text-center p-4">
                <h5 className="fw-bold">Message Sent!</h5>
                <p className="mb-0 small">The Training & Placement Cell will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Your Name</label>
                  <input type="text" className="form-control glass-card text-body" required placeholder="John Doe" />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Email Address</label>
                  <input type="email" className="form-control glass-card text-body" required placeholder="student@college.edu" />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Message / Query</label>
                  <textarea className="form-control glass-card text-body" rows="4" required placeholder="Type your query regarding placement drives or profile verification..."></textarea>
                </div>

                <button type="submit" className="btn btn-brand w-100 py-2">
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
