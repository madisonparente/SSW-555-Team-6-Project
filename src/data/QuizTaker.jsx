import React, { useState } from "react";
import { saveQuizResult } from "./results";

const QuizTaker = ({ quiz, responses, onSubmitAnswer }) => {
  const [selected, setSelected] = useState(null);
  const question = quiz.questions[quiz.currentQuestionIndex];

  if (!question) {
    // Quiz finished — show score
    const total = quiz.questions.length;
    const correct = quiz.questions.filter(
      (q) => responses[q.id] === q.correctIndex,
    ).length;
    const pct = Math.round((correct / total) * 100);

    // Save result for reporting
    saveQuizResult({
      quizId: quiz.id,
      title: quiz.title,
      score: correct,
      total: total,
      percentage: pct,
      responses: responses,
      timestamp: Date.now(),
    });

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
