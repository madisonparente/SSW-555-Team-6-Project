import React from "react";

import USERS from "../data/users";

const Header = ({ role, setRole, onCalendarClick, showCalendar, onDashboardClick, showDashboard, onStudyGroupsClick, showStudyGroups, onRecordingsClick, showRecordings }) => {
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
              className={`calendar-nav-btn ${showStudyGroups ? "active" : ""}`}
              onClick={onStudyGroupsClick}
              title="Study groups"
            >
              🤝 Study Groups
            </button>
            <button
              className={`calendar-nav-btn ${showRecordings ? "active" : ""}`}
              onClick={onRecordingsClick}
              title="View recordings"
            >
              🎥 Recordings
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
