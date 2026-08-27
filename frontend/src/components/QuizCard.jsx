import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaClipboardCheck, FaQuestionCircle, FaTrashAlt } from 'react-icons/fa';

const QuizCard = ({ quiz, onDelete, isManage = false, completed = false, result }) => {
  return (
    <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1 fw-semibold">
            {quiz.category}
          </span>
          <span className="text-muted small d-flex align-items-center gap-1">
            <FaQuestionCircle size={14} /> {quiz.questionCount || 0} Questions
          </span>
        </div>

        <h5 className="fw-bold mb-2">{quiz.title}</h5>
        <p className="text-muted small mb-3">
          Total Marks: {quiz.totalMarks} | Assessment score automatically counts towards your Placement Readiness Score.
        </p>
      </div>

      <div className="d-flex align-items-center justify-content-between pt-3 border-top border-secondary border-opacity-10">
        {!isManage && completed ? (
          <div className="btn btn-success btn-sm d-flex align-items-center gap-2 rounded-3 w-100 justify-content-center disabled" aria-disabled="true">
            <FaCheckCircle size={14} /> Completed{result ? ` · ${result.score}%` : ''}
          </div>
        ) : !isManage ? (
          <Link to={`/student/quiz/${quiz._id}`} className="btn btn-brand btn-sm d-flex align-items-center gap-2 rounded-3 w-100 justify-content-center">
            <FaClipboardCheck size={14} /> Start Assessment
          </Link>
        ) : (
          <div className="d-flex align-items-center justify-content-between w-100">
            <span className="badge bg-secondary">Manage Mode</span>
            {onDelete && (
              <button onClick={() => onDelete(quiz._id)} className="btn btn-sm btn-outline-danger rounded-3">
                <FaTrashAlt size={14} /> Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCard;
