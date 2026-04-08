import React from "react";

import USERS from "../data/users";

<<<<<<< HEAD
const Header = ({ role, setRole, onCalendarClick, showCalendar, onDashboardClick, showDashboard, onStudyGroupsClick, showStudyGroups }) => {
=======
const Header = ({ role, setRole, onCalendarClick, showCalendar, onDashboardClick, showDashboard, onRecordingsClick, showRecordings }) => {
>>>>>>> d6fd7b7d8eafd0478b03042100daef8eaf767e6c
  const user = USERS[role];

  return (
    <header className="header">
      <div className="header-logo">
        <div className="logo-icon">📚</div>
        <span className="logo-text">ClassRoom</span>
      </div>
      <div className="header-right">
        {role === "student" && (
          <>
            <button
              className={`calendar-nav-btn ${showCalendar ? "active" : ""}`}
              onClick={onCalendarClick}
              title="View calendar"
            >
              📅 Calendar
            </button>
            <button
              className={`calendar-nav-btn ${showDashboard ? "active" : ""}`}
              onClick={onDashboardClick}
              title="View dashboard"
            >
              📊 Dashboard
            </button>
            <button
<<<<<<< HEAD
              className={`calendar-nav-btn ${showStudyGroups ? "active" : ""}`}
              onClick={onStudyGroupsClick}
              title="Study groups"
            >
              🤝 Study Groups
=======
              className={`calendar-nav-btn ${showRecordings ? "active" : ""}`}
              onClick={onRecordingsClick}
              title="View recordings"
            >
              🎥 Recordings
>>>>>>> d6fd7b7d8eafd0478b03042100daef8eaf767e6c
            </button>
          </>
        )}
        <div className="role-toggle">
          {["student", "teacher"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`role-btn ${role === r ? "active" : ""}`}
            >
              {r === "student" ? "🎓 Student" : "👩‍🏫 Teacher"}
            </button>
          ))}
        </div>
        <div className="user-badge">
          <span className="user-avatar">{user.avatar}</span>
          <span className="user-name">{user.name}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
