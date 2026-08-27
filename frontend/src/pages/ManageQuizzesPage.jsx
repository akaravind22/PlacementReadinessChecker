import React, { useState, useEffect } from 'react';
import API from '../services/api';
import QuizCard from '../components/QuizCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ToastAlert from '../components/ToastAlert';
import { FaQuestionCircle, FaPlus } from 'react-icons/fa';

const ManageQuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New Quiz form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technical');
  const [totalMarks, setTotalMarks] = useState(100);

  // Add Question form state
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(0);

  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchQuizzes = async () => {
    try {
      const res = await API.get('/quizzes');
      setQuizzes(res.data.quizzes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await API.post('/quizzes', { title, category, totalMarks });
      setTitle('');
      setMsg({ text: 'Quiz assessment created successfully!', type: 'success' });
      fetchQuizzes();
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to create quiz.', type: 'danger' });
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!selectedQuizId || !questionText || !opt0 || !opt1) return;

    const options = [opt0, opt1];
    if (opt2.trim()) options.push(opt2);
    if (opt3.trim()) options.push(opt3);

    try {
      await API.post('/quizzes/questions', {
        quizId: selectedQuizId,
        question: questionText,
        options,
        correctAnswer: parseInt(correctAnswer, 10)
      });
      setQuestionText('');
      setOpt0('');
      setOpt1('');
      setOpt2('');
      setOpt3('');
      setMsg({ text: 'Question added to quiz!', type: 'success' });
      fetchQuizzes();
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to add question.', type: 'danger' });
    }
  };

  const handleDeleteQuiz = async (id) => {
    try {
      await API.delete(`/quizzes/${id}`);
      setMsg({ text: 'Quiz deleted.', type: 'info' });
      fetchQuizzes();
    } catch (err) {
      setMsg({ text: 'Failed to delete quiz.', type: 'danger' });
    }
  };

  if (loading) return <LoadingSpinner message="Loading Quizzes Management..." />;

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="p-3 rounded-circle bg-info-subtle text-info">
          <FaQuestionCircle size={24} />
        </div>
        <div>
          <h2 className="fw-bold mb-0">Quizzes & Assessment Manager</h2>
          <p className="text-muted small mb-0">Create new quizzes, add multiple choice questions, and set answer keys</p>
        </div>
      </div>

      <ToastAlert message={msg.text} type={msg.type} onClose={() => setMsg({ text: '', type: '' })} />

      <div className="row g-4 mb-4">
        {/* Create Quiz Box */}
        <div className="col-lg-5">
          <div className="glass-card p-4 h-100">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <FaPlus size={16} /> Create Quiz Category
            </h5>
            <form onSubmit={handleCreateQuiz}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Quiz Title *</label>
                <input
                  type="text"
                  className="form-control glass-card text-body"
                  placeholder="Data Structures & Algorithms Mock"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Assessment Category</label>
                <select className="form-select glass-card text-body" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Technical">Technical</option>
                  <option value="Aptitude">Aptitude</option>
                  <option value="Core CS">Core CS</option>
                  <option value="Verbal">Verbal</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Total Marks</label>
                <input
                  type="number"
                  className="form-control glass-card text-body"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-brand w-100 py-2">
                Create Quiz Header
              </button>
            </form>
          </div>
        </div>

        {/* Add Question Box */}
        <div className="col-lg-7">
          <div className="glass-card p-4 h-100">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <FaPlus size={16} /> Add Question to Quiz
            </h5>
            <form onSubmit={handleAddQuestion}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Target Quiz *</label>
                <select
                  className="form-select glass-card text-body"
                  value={selectedQuizId}
                  onChange={(e) => setSelectedQuizId(e.target.value)}
                  required
                >
                  <option value="">-- Select Quiz --</option>
                  {quizzes.map((q) => (
                    <option key={q._id} value={q._id}>{q.title} ({q.category})</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Question Text *</label>
                <input
                  type="text"
                  className="form-control glass-card text-body"
                  placeholder="Which HTTP status code represents 201 Created?"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control glass-card text-body form-control-sm"
                    placeholder="Option A *"
                    value={opt0}
                    onChange={(e) => setOpt0(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control glass-card text-body form-control-sm"
                    placeholder="Option B *"
                    value={opt1}
                    onChange={(e) => setOpt1(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control glass-card text-body form-control-sm"
                    placeholder="Option C"
                    value={opt2}
                    onChange={(e) => setOpt2(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control glass-card text-body form-control-sm"
                    placeholder="Option D"
                    value={opt3}
                    onChange={(e) => setOpt3(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Correct Option Answer Index</label>
                <select className="form-select glass-card text-body" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)}>
                  <option value={0}>Option A (Index 0)</option>
                  <option value={1}>Option B (Index 1)</option>
                  <option value={2}>Option C (Index 2)</option>
                  <option value={3}>Option D (Index 3)</option>
                </select>
              </div>

              <button type="submit" className="btn btn-outline-brand w-100 py-2">
                Add Question to Selected Quiz
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Quizzes List */}
      <h5 className="fw-bold mb-3">Existing System Quizzes ({quizzes.length})</h5>
      <div className="row g-3">
        {quizzes.map((quiz) => (
          <div key={quiz._id} className="col-md-6 col-lg-4">
            <QuizCard quiz={quiz} onDelete={handleDeleteQuiz} isManage={true} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageQuizzesPage;
