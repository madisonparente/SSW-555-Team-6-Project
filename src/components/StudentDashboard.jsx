import React from "react";

const attendanceEventIds = [1, 2, 3, 5, 6, 9];

const getUpcomingMilestones = (events) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return events
    .filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= today && ["deadline", "class", "tutoring"].includes(event.type);
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 4);
};

const StudentDashboard = ({ studentId, events, results = [] }) => {
  const studentResults = results.filter((result) => result.studentId === studentId);
  const quizCount = studentResults.length;
  const averageScore = quizCount
    ? Math.round(studentResults.reduce((sum, result) => sum + result.percentage, 0) / quizCount)
    : 0;
  const bestScore = quizCount
    ? Math.max(...studentResults.map((result) => result.percentage))
    : 0;
  const classEvents = events.filter((event) => event.type === "class");
  const attended = classEvents.filter((event) => attendanceEventIds.includes(event.id)).length;
  const attendanceRate = classEvents.length
    ? Math.round((attended / classEvents.length) * 100)
    : 0;
  const upcomingMilestones = getUpcomingMilestones(events);

  return (
    <section className="dashboard-panel">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-overline">Personal Progress</p>
          <h2 className="dashboard-title">Student Growth Dashboard</h2>
          <p className="dashboard-subtitle">
            Track your quiz performance, attendance consistency, and the next milestones to stay focused.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card dashboard-summary-card">
          <h3>Quiz Progress</h3>
          <div className="dashboard-stat-row">
            <div className="dashboard-stat">
              <span className="dashboard-stat-value">{averageScore}%</span>
              <span className="dashboard-stat-label">Average Score</span>
            </div>
            <div className="dashboard-stat">
              <span className="dashboard-stat-value">{bestScore}%</span>
              <span className="dashboard-stat-label">Top Quiz</span>
            </div>
            <div className="dashboard-stat">
              <span className="dashboard-stat-value">{quizCount}</span>
              <span className="dashboard-stat-label">Quizzes Taken</span>
            </div>
          </div>

          <div className="dashboard-chart-card">
            <div className="dashboard-chart-label">Average quiz mastery</div>
            <div className="dashboard-progress-bar">
              <div
                className="dashboard-progress-fill"
                style={{ width: `${averageScore}%` }}
              />
            </div>
          </div>
        </div>

        <div className="dashboard-card dashboard-attendance-card">
          <h3>Attendance</h3>
          <div className="attendance-info">
            <div className="attendance-value">{attendanceRate}%</div>
            <div className="attendance-label">Consistency Rate</div>
          </div>
          <div className="dashboard-progress-bar attendance-bar">
            <div
              className="dashboard-progress-fill"
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
          <p className="attendance-detail">
            You attended {attended} of {classEvents.length} scheduled class sessions.
          </p>
        </div>

        <div className="dashboard-card dashboard-milestones-card">
          <h3>Upcoming Milestones</h3>
          <div className="milestone-list">
            {upcomingMilestones.length ? (
              upcomingMilestones.map((milestone) => (
                <article key={milestone.id} className="milestone-item">
                  <span className="milestone-type">{milestone.type === "deadline" ? "Deadline" : milestone.type === "tutoring" ? "Tutoring" : "Class"}</span>
                  <h4>{milestone.title}</h4>
                  <p>{milestone.date}</p>
                </article>
              ))
            ) : (
              <p className="empty-text">No milestone events are scheduled yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-card recent-scores-card">
        <h3>Recent Quiz Scores</h3>
        {quizCount ? (
          <div className="recent-scores-list">
            {studentResults
              .slice(-4)
              .reverse()
              .map((result) => (
                <div key={`${result.quizId}-${result.score}`} className="recent-score-item">
                  <div>
                    <p className="recent-score-title">{result.title}</p>
                    <p className="recent-score-meta">{result.score}/{result.total} points</p>
                  </div>
                  <span className="recent-score-badge">{result.percentage}%</span>
                </div>
              ))}
          </div>
        ) : (
          <p className="empty-text">Complete a quiz to populate your growth dashboard.</p>
        )}
      </div>
    </section>
  );
};

export default StudentDashboard;
