import React from "react";
import QuizCreator from "./QuizCreator";
import QuizTaker from "./QuizTaker";
import { getRecommendations } from "../utils/getRecommendations";

const QuizPanel = ({
  role,
  courseId,
  quizzes,
  studentResponses,
  onCreateQuiz,
  onLaunchQuiz,
  onAdvanceQuestion,
  onEndQuiz,
  onSubmitAnswer,
  recordings = [],
}) => {
  const courseQuizzes = quizzes.filter((q) => q.courseId === courseId);
  const activeQuiz = courseQuizzes.find((q) => q.status === "active");

  if (role === "teacher") {
    return (
      <QuizCreator
        courseId={courseId}
        quizzes={courseQuizzes}
        studentResponses={studentResponses}
        onCreateQuiz={onCreateQuiz}
        onLaunchQuiz={onLaunchQuiz}
        onAdvanceQuestion={onAdvanceQuestion}
        onEndQuiz={onEndQuiz}
      />
    );
  }

  if (activeQuiz) {
    return (
      <QuizTaker
        quiz={activeQuiz}
        responses={studentResponses[activeQuiz.id] || {}}
        onSubmitAnswer={onSubmitAnswer}
        recordings={recordings}
      />
    );
  }

  const finishedQuiz = courseQuizzes
    .filter((q) => q.status === "finished")
    .find((q) => studentResponses[q.id]);

  if (finishedQuiz) {
    const responses = studentResponses[finishedQuiz.id] || {};
    const total = finishedQuiz.questions.length;
    const correct = finishedQuiz.questions.filter(
      (q) => responses[q.id] === q.correctIndex,
    ).length;
    const pct = Math.round((correct / total) * 100);
    const recs = getRecommendations(finishedQuiz, responses, recordings);

    return (
      <div className="announcements-panel" style={{ marginBottom: 24 }}>
        <h2 className="announcements-title">📝 Quizzes</h2>
        <div className={`quiz-score-card ${pct >= 70 ? "score-good" : "score-bad"}`}>
          <div className="score-value">
            {correct}/{total}
          </div>
          <div className="score-pct">{pct}%</div>
          <div className="score-label">{finishedQuiz.title} — Final Score</div>
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

  return (
    <div className="announcements-panel" style={{ marginBottom: 24 }}>
      <h2 className="announcements-title">📝 Quizzes</h2>
      <p className="empty-text">No active quiz right now.</p>
    </div>
  );
};

export default QuizPanel;
