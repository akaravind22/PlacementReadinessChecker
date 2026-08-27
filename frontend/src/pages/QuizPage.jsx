import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ToastAlert from '../components/ToastAlert';
import { FaClock, FaCheckCircle } from 'react-icons/fa';

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const startQuiz = async () => {
      try {
        const res = await API.post(`/quizzes/${id}/start`);
        setQuiz(res.data.quiz);
        setQuestions(res.data.questions || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load quiz questions.');
      } finally {
        setLoading(false);
      }
    };

    startQuiz();
  }, [id]);

  const handleSelectOption = (questionId, optionIdx) => {
    setAnswers({ ...answers, [questionId]: optionIdx });
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    setError('');

    const formattedAnswers = Object.keys(answers).map(qId => ({
      questionId: qId,
      selectedOption: answers[qId]
    }));

    try {
      const res = await API.post(`/quizzes/${id}/submit`, { answers: formattedAnswers });
      navigate('/student/quiz-result', { state: { result: res.data.result, quizTitle: quiz?.title } });
    } catch (err) {
      setError(err.response?.data?.message || 'Quiz submission failed.');
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Starting Quiz Test Engine..." />;
  if (error) return <div className="container py-5"><ToastAlert message={error} /></div>;

  return (
    <div className="container py-4">
      <div className="glass-card p-4 mb-4 d-flex justify-content-between align-items-center">
        <div>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1 mb-2">
            {quiz?.category} Assessment
          </span>
          <h3 className="fw-bold mb-0">{quiz?.title}</h3>
        </div>

        <div className="d-flex align-items-center gap-2 text-warning fw-bold fs-5">
          <FaClock /> <span>{questions.length} Questions</span>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          {questions.map((q, qIdx) => (
            <div key={q._id} className="glass-card p-4 mb-4">
              <h5 className="fw-bold mb-3">
                Question {qIdx + 1}: {q.question}
              </h5>

              <div className="d-flex flex-column gap-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = answers[q._id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(q._id, optIdx)}
                      className={`btn text-start p-3 rounded-3 d-flex align-items-center justify-content-between ${
                        isSelected 
                          ? 'btn-primary border-primary fw-bold text-white shadow-sm' 
                          : 'btn-outline-secondary text-body glass-card border-secondary border-opacity-25'
                      }`}
                    >
                      <span>
                        <strong className="me-2">{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                      </span>
                      {isSelected && <FaCheckCircle size={18} />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-end mb-5">
            <button
              onClick={handleSubmitQuiz}
              className="btn btn-brand btn-lg px-5 py-3 rounded-3 fw-bold"
              disabled={submitting}
            >
              {submitting ? 'Submitting Answers...' : 'Submit Quiz Assessment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
