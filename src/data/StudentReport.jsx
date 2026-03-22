import React from "react";
import { getResultsByStudent } from "./results";

const StudentReport = ({ studentId }) => {
  const results = getResultsByStudent(studentId);

  if (!results.length) {
    return <p>No quiz attempts yet.</p>;
  }

  return (
    <div className="announcements-panel">
      <h2 className="announcements-title">My Quiz Performance</h2>

      {results.map((r, i) => (
        <div key={i} className="quiz-score-card">
          <div className="score-value">
            {r.score}/{r.total}
          </div>

          <div className="score-pct">{r.percentage}%</div>

          <div className="score-label">{r.title}</div>
        </div>
      ))}
    </div>
  );
};

export default StudentReport;