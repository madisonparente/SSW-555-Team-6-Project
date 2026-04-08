import React, { useState } from "react";
import { getRecommendations } from "../utils/getRecommendations";

const QuizTaker = ({ quiz, responses, onSubmitAnswer, recordings = [] }) => {
  const [selected, setSelected] = useState(null);
  const question = quiz.questions[quiz.currentQuestionIndex];

  if (!question) {
    // Quiz finished — show score
    const total = quiz.questions.length;
    const correct = quiz.questions.filter(
      (q) => responses[q.id] === q.correctIndex,
    ).length;
    const pct = Math.round((correct / total) * 100);
    const recs = getRecommendations(quiz, responses, recordings);

    return (
      <div className="announcements-panel" style={{ marginBottom: 24 }}>
        <h2 className="announcements-title">📝 {quiz.title}</h2>
        <div className={`quiz-score-card ${pct >= 70 ? "score-good" : "score-bad"}`}>
          <div className="score-value">
            {correct}/{total}
          </div>
          <div className="score-pct">{pct}%</div>
          <div className="score-label">Final Score</div>
        </div>
        {recs.length > 0 && (
          <div className="recommendations-section">
            <h3 className="recommendations-title">Recommended Review Materials</h3>
            <p className="recommendations-subtitle">
              Based on the questions you missed, these recordings may help:
            </p>
            {recs.map((r) => (
              <div key={r.id} className="recommendation-card">
                <div className="recommendation-info">
                  <div className="recommendation-name">{r.title}</div>
                  <div className="recommendation-meta">
                    {r.duration} · {r.date}
                  </div>
                </div>
                <a
                  href={r.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="recording-watch-btn"
                  style={{ background: "#6366f1" }}
                >
                  Watch
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const hasAnswered = responses[question.id] !== undefined;
  const answeredIndex = responses[question.id];
  const labels = ["A", "B", "C", "D"];

  const handleSubmit = () => {
    if (selected === null) return;
    onSubmitAnswer(quiz.id, question.id, selected);
    setSelected(null);
  };

  return (
    <div className="announcements-panel" style={{ marginBottom: 24 }}>
      <h2 className="announcements-title">📝 {quiz.title}</h2>
      <div className="quiz-progress-bar">
        <div
          className="quiz-progress-fill"
          style={{
            width: `${((quiz.currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
          }}
        />
      </div>
      <div className="quiz-progress-text">
        Question {quiz.currentQuestionIndex + 1} of {quiz.questions.length}
      </div>

      <div className="quiz-question-text">{question.text}</div>

      <div className="quiz-options">
        {question.options.map((opt, i) => {
          let cls = "quiz-option-card";
          if (hasAnswered) {
            if (i === question.correctIndex) cls += " correct";
            else if (i === answeredIndex) cls += " incorrect";
          } else if (i === selected) {
            cls += " selected";
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => !hasAnswered && setSelected(i)}
              disabled={hasAnswered}
            >
              <span className="option-label">{labels[i]}</span>
              <span className="option-text">{opt}</span>
            </button>
          );
        })}
      </div>

      {!hasAnswered ? (
        <button
          className="quiz-submit-btn"
          onClick={handleSubmit}
          disabled={selected === null}
        >
          Submit Answer
        </button>
      ) : (
        <div className="quiz-waiting">
          {answeredIndex === question.correctIndex
            ? "Correct!"
            : "Incorrect — the correct answer is highlighted."}
          <br />
          Waiting for next question...
        </div>
      )}
    </div>
  );
};

export default QuizTaker;
