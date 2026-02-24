import React from "react";

import USERS from "../data/users";

const Header = ({ role, setRole }) => {
  const user = USERS[role];

  return (
    <header className="header">
      <div className="header-logo">
        <div className="logo-icon">📚</div>
        <span className="logo-text">ClassRoom</span>
      </div>
      <div className="header-right">
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
