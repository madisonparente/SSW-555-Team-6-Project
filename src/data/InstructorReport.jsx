import React from "react";
import { getResultsByQuiz } from "./results";

const InstructorReport = ({ quiz }) => {
  const results = getResultsByQuiz(quiz.id);

  if (!results.length) {
    return <p>No students have completed this quiz yet.</p>;
  }

  const avg =
    results.reduce((sum, r) => sum + r.percentage, 0) / results.length;

  return (
    <div className="announcements-panel">
      <h2 className="announcements-title">Instructor Report</h2>

      <p><strong>Quiz:</strong> {quiz.title}</p>
      <p><strong>Attempts:</strong> {results.length}</p>
      <p><strong>Average Score:</strong> {avg.toFixed(1)}%</p>

      {results.map((r, i) => (
        <div key={i}>
          Attempt {i + 1}: {r.score}/{r.total} ({r.percentage}%)
        </div>
      ))}
    </div>
  );
};

export default InstructorReport;