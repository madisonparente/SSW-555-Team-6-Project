import React from "react";
import QuizCreator from "./QuizCreator";
import QuizTaker from "./QuizTaker";
import StudentReport from "./StudentReport";
import InstructorReport from "./InstructorReport";

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
}) => {
  const courseQuizzes = quizzes.filter((q) => q.courseId === courseId);
  const activeQuiz = courseQuizzes.find((q) => q.status === "active");

  if (role === "teacher") {
    return (
      <>
      <QuizCreator
        courseId={courseId}
        quizzes={courseQuizzes}
        studentResponses={studentResponses}
        onCreateQuiz={onCreateQuiz}
        onLaunchQuiz={onLaunchQuiz}
        onAdvanceQuestion={onAdvanceQuestion}
        onEndQuiz={onEndQuiz}
      />

      {courseQuizzes.map((q) => (
      <InstructorReport key={q.id} quiz={q} />
    ))}
      </>
    );
  }

  if (activeQuiz) {
    return (
      <QuizTaker
        quiz={activeQuiz}
        responses={studentResponses[activeQuiz.id] || {}}
        onSubmitAnswer={onSubmitAnswer}
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
      </div>
    );
  }

  <StudentReport studentId={1} />

  return (
    <div className="announcements-panel" style={{ marginBottom: 24 }}>
      <h2 className="announcements-title">📝 Quizzes</h2>
      <p className="empty-text">No active quiz right now.</p>
    </div>
  );
};

export default QuizPanel;
