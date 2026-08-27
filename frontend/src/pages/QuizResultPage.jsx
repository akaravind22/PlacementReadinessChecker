import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaTrophy, FaArrowRight, FaChartPie } from 'react-icons/fa';

const QuizResultPage = () => {
  const location = useLocation();
  const result = location.state?.result;
  const quizTitle = location.state?.quizTitle || 'Assessment';

  if (!result) {
    return (
      <div className="container py-5 text-center">
        <h4>No recent quiz result found.</h4>
        <Link to="/student/quizzes" className="btn btn-brand mt-3">Back to Quizzes</Link>
      </div>
    );
  }

  const { scorePercentage, correctAnswersCount, totalQuestions } = result;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="glass-card p-5 text-center">
            <div className="p-4 rounded-circle bg-warning-subtle text-warning d-inline-block mb-3">
              <FaTrophy size={48} />
            </div>

            <h2 className="fw-bold mb-1">Assessment Completed!</h2>
            <p className="text-muted mb-4">{quizTitle}</p>

            <div className="glass-card p-4 mb-4 bg-body-tertiary">
              <div className="display-3 fw-bold gradient-text mb-2">{scorePercentage}%</div>
              <p className="fw-semibold text-body mb-0">
                You answered {correctAnswersCount} out of {totalQuestions} questions correctly.
              </p>
            </div>

            <p className="text-muted small mb-4">
              Your test score has been automatically compiled into your <strong>Placement Readiness Score</strong> and updated on your dashboard.
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/student-dashboard" className="btn btn-brand py-2.5 px-4 rounded-3 d-flex align-items-center gap-2">
                <FaChartPie /> View Dashboard Score
              </Link>
              <Link to="/student/quizzes" className="btn btn-outline-brand py-2.5 px-4 rounded-3 d-flex align-items-center gap-2">
                More Quizzes <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResultPage;
