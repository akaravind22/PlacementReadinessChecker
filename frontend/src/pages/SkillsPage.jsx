import React, { useState, useEffect } from 'react';
import API from '../services/api';
import SkillCard from '../components/SkillCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ToastAlert from '../components/ToastAlert';
import { FaCode, FaPlus } from 'react-icons/fa';

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skillName, setSkillName] = useState('');
  const [level, setLevel] = useState('Intermediate');
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchSkills = async () => {
    try {
      const res = await API.get('/student/skills');
      setSkills(res.data.skills || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    try {
      await API.post('/student/skills', { skillName, level });
      setSkillName('');
      setMsg({ text: 'Technical skill added successfully!', type: 'success' });
      fetchSkills();
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to add skill.', type: 'danger' });
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await API.delete(`/student/skills/${id}`);
      setMsg({ text: 'Skill removed.', type: 'info' });
      fetchSkills();
    } catch (err) {
      setMsg({ text: 'Failed to delete skill.', type: 'danger' });
    }
  };

  if (loading) return <LoadingSpinner message="Loading Technical Skills..." />;

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="p-3 rounded-circle bg-primary-subtle text-primary">
          <FaCode size={24} />
        </div>
        <div>
          <h2 className="fw-bold mb-0">Technical Skills Portfolio</h2>
          <p className="text-muted small mb-0">Add your programming languages, frameworks, databases, and core CS skills</p>
        </div>
      </div>

      <ToastAlert message={msg.text} type={msg.type} onClose={() => setMsg({ text: '', type: '' })} />

      <div className="row g-4">
        {/* Add Skill Form */}
        <div className="col-lg-4">
          <div className="glass-card p-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <FaPlus size={16} /> Add Technical Skill
            </h5>
            <form onSubmit={handleAddSkill}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Skill Name</label>
                <input
                  type="text"
                  className="form-control glass-card text-body"
                  placeholder="e.g. Data Structures & Algorithms, React, Java"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Proficiency Level</label>
                <select 
                  className="form-select glass-card text-body"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <button type="submit" className="btn btn-brand w-100 py-2">
                Add Skill to Profile
              </button>
            </form>
          </div>
        </div>

        {/* Skills List */}
        <div className="col-lg-8">
          <div className="glass-card p-4">
            <h5 className="fw-bold mb-3">Your Skills ({skills.length})</h5>

            {skills.length === 0 ? (
              <p className="text-muted small">No technical skills added yet. Add skills to boost your score!</p>
            ) : (
              <div className="row g-2">
                {skills.map((skill) => (
                  <div key={skill._id} className="col-md-6">
                    <SkillCard skill={skill} onDelete={handleDeleteSkill} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsPage;
