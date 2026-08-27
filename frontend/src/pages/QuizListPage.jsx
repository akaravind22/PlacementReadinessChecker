import React, { useState, useEffect } from 'react';
import API from '../services/api';
import QuizCard from '../components/QuizCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaQuestionCircle } from 'react-icons/fa';

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, resRes] = await Promise.all([
          API.get('/quizzes'),
          API.get('/quizzes/results')
        ]);
        setQuizzes(quizRes.data.quizzes || []);
        setResults(resRes.data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading Placement Practice Quizzes..." />;

  // quizId is populated by the results endpoint, but this also supports an id-only result.
  const resultsByQuizId = new Map(
    results
      .filter((result) => result.quizId)
      .map((result) => [String(result.quizId?._id || result.quizId), result])
  );

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="p-3 rounded-circle bg-danger-subtle text-danger">
          <FaQuestionCircle size={24} />
        </div>
        <div>
          <h2 className="fw-bold mb-0">Placement Practice Quizzes</h2>
          <p className="text-muted small mb-0">Take technical and aptitude assessments to boost test accuracy & score points</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <h5 className="fw-bold mb-3">Available Assessments</h5>
          <div className="row g-3">
            {quizzes.length === 0 ? (
              <div className="col-12">
                <p className="text-muted">No quizzes available right now. Placement Officers update quizzes regularly.</p>
              </div>
            ) : (
              quizzes.map((quiz) => {
                const result = resultsByQuizId.get(String(quiz._id));
                return (
                <div key={quiz._id} className="col-md-6">
                  <QuizCard quiz={quiz} completed={Boolean(result)} result={result} />
                </div>
                );
              })
            )}
          </div>
        </div>

        {/* Past Quiz Attempt Results */}
        <div className="col-lg-4">
          <div className="glass-card p-4">
            <h5 className="fw-bold mb-3">Recent Test History</h5>

            {results.length === 0 ? (
              <p className="text-muted small">You haven't attempted any quizzes yet.</p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {results.map((res) => (
                  <div key={res._id} className="p-3 rounded-3 border border-secondary border-opacity-10 bg-body-tertiary">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <h6 className="fw-bold mb-0 text-truncate" style={{ maxWidth: '160px' }}>
                        {res.quizId?.title || 'Quiz'}
                      </h6>
                      <span className={`badge ${res.score >= 70 ? 'bg-success' : res.score >= 50 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                        {res.score}%
                      </span>
                    </div>
                    <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                      Correct: {res.correctAnswersCount}/{res.totalQuestions} • {new Date(res.attemptDate).toLocaleDateString()}
                    </span>
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

export default QuizListPage;
