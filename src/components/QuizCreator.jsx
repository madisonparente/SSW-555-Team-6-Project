import React, { useState } from "react";

const QuizCreator = ({
  courseId,
  quizzes,
  studentResponses,
  onCreateQuiz,
  onLaunchQuiz,
  onAdvanceQuestion,
  onEndQuiz,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { text: "", options: ["", "", "", ""], correctIndex: 0 },
  ]);
  const [reviewQuizId, setReviewQuizId] = useState(null);

  const activeQuiz = quizzes.find((q) => q.status === "active");

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { text: "", options: ["", "", "", ""], correctIndex: 0 },
    ]);
  };

  const updateQuestion = (qi, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qi ? { ...q, [field]: value } : q)),
    );
  };

  const updateOption = (qi, oi, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qi
          ? { ...q, options: q.options.map((o, j) => (j === oi ? value : o)) }
          : q,
      ),
    );
  };

  const handleSave = () => {
    if (!title.trim()) return;
    if (questions.some((q) => !q.text.trim() || q.options.some((o) => !o.trim())))
      return;
    onCreateQuiz(courseId, title, questions);
    setTitle("");
    setQuestions([{ text: "", options: ["", "", "", ""], correctIndex: 0 }]);
    setShowForm(false);
  };

  const labels = ["A", "B", "C", "D"];

  // Live dashboard for active quiz
  if (activeQuiz) {
    const question = activeQuiz.questions[activeQuiz.currentQuestionIndex];
    const isLastQuestion =
      activeQuiz.currentQuestionIndex >= activeQuiz.questions.length - 1;

    // Simulated response counts for the dashboard
    const responses = studentResponses[activeQuiz.id] || {};
    const hasResponse = question && responses[question.id] !== undefined;

    return (
      <div className="announcements-panel" style={{ marginBottom: 24 }}>
        <h2 className="announcements-title">📝 Live Quiz: {activeQuiz.title}</h2>

        {question ? (
          <>
            <div className="quiz-progress-text" style={{ marginBottom: 12 }}>
              Question {activeQuiz.currentQuestionIndex + 1} of{" "}
              {activeQuiz.questions.length}
            </div>
            <div className="quiz-question-text">{question.text}</div>

            <div className="quiz-result-bars">
              {question.options.map((opt, i) => {
                const isCorrect = i === question.correctIndex;
                const wasChosen = hasResponse && responses[question.id] === i;
                return (
                  <div key={i} className="result-bar-row">
                    <span className="result-bar-label">
                      {labels[i]}. {opt}
                    </span>
                    <div className="result-bar-track">
                      <div
                        className={`result-bar-fill ${isCorrect ? "correct" : ""}`}
                        style={{ width: wasChosen || isCorrect ? "60%" : "10%" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="quiz-dashboard-actions">
              {!isLastQuestion ? (
                <button
                  className="quiz-submit-btn"
                  onClick={() => onAdvanceQuestion(activeQuiz.id)}
                >
                  Next Question
                </button>
              ) : null}
              <button
                className="quiz-end-btn"
                onClick={() => onEndQuiz(activeQuiz.id)}
              >
                End Quiz
              </button>
            </div>
          </>
        ) : (
          <p className="empty-text">All questions completed.</p>
        )}
      </div>
    );
  }

  // Review a finished quiz
  if (reviewQuizId) {
    const quiz = quizzes.find((q) => q.id === reviewQuizId);
    if (quiz) {
      return (
        <div className="announcements-panel" style={{ marginBottom: 24 }}>
          <h2 className="announcements-title">📝 Results: {quiz.title}</h2>
          {quiz.questions.map((q, qi) => (
            <div key={q.id} className="quiz-review-question">
              <div className="quiz-question-text" style={{ fontSize: 14 }}>
                {qi + 1}. {q.text}
              </div>
              <div className="quiz-review-options">
                {q.options.map((opt, i) => (
                  <div
                    key={i}
                    className={`quiz-review-option ${i === q.correctIndex ? "correct" : ""}`}
                  >
                    {labels[i]}. {opt}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button
            className="quiz-submit-btn"
            style={{ marginTop: 12 }}
            onClick={() => setReviewQuizId(null)}
          >
            Back to Quiz List
          </button>
        </div>
      );
    }
  }

  return (
    <div className="announcements-panel" style={{ marginBottom: 24 }}>
      <h2 className="announcements-title">📝 Quizzes</h2>

      {/* Quiz list */}
      <div className="quiz-list">
        {quizzes.map((q) => (
          <div key={q.id} className="quiz-list-item">
            <div className="quiz-list-info">
              <span className="quiz-list-title">{q.title}</span>
              <span className={`quiz-status-badge ${q.status}`}>
                {q.status === "inactive"
                  ? "Draft"
                  : q.status === "active"
                    ? "Live"
                    : "Finished"}
              </span>
            </div>
            <div className="quiz-list-actions">
              {q.status === "inactive" && (
                <button
                  className="quiz-action-btn launch"
                  onClick={() => onLaunchQuiz(q.id)}
                >
                  Launch
                </button>
              )}
              {q.status === "finished" && (
                <button
                  className="quiz-action-btn review"
                  onClick={() => setReviewQuizId(q.id)}
                >
                  Review
                </button>
              )}
            </div>
          </div>
        ))}
        {quizzes.length === 0 && (
          <p className="empty-text">No quizzes created yet.</p>
        )}
      </div>

      {/* Create form toggle */}
      {!showForm ? (
        <button
          className="quiz-submit-btn"
          style={{ marginTop: 12 }}
          onClick={() => setShowForm(true)}
        >
          + Create Quiz
        </button>
      ) : (
        <div className="quiz-create-form">
          <div className="form-header">
            <h3>New Quiz</h3>
            <button className="form-close" onClick={() => setShowForm(false)}>
              ✕
            </button>
          </div>

          <label className="form-label">Title</label>
          <input
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Quiz title..."
          />

          {questions.map((q, qi) => (
            <div key={qi} className="quiz-question-builder">
              <label className="form-label">Question {qi + 1}</label>
              <input
                className="form-input"
                value={q.text}
                onChange={(e) => updateQuestion(qi, "text", e.target.value)}
                placeholder="Enter question..."
              />
              <div className="quiz-options-builder">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="quiz-option-row">
                    <input
                      type="radio"
                      name={`correct-${qi}`}
                      checked={q.correctIndex === oi}
                      onChange={() => updateQuestion(qi, "correctIndex", oi)}
                    />
                    <span className="option-label">{labels[oi]}</span>
                    <input
                      className="form-input"
                      value={opt}
                      onChange={(e) => updateOption(qi, oi, e.target.value)}
                      placeholder={`Option ${labels[oi]}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="quiz-form-actions">
            <button className="quiz-action-btn launch" onClick={addQuestion}>
              + Add Question
            </button>
            <button className="quiz-submit-btn" onClick={handleSave}>
              Save Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizCreator;
