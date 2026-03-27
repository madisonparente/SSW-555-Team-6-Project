import React from "react";

const CalendarHeader = ({ onBack }) => {
  return (
    <div className="calendar-header">
      <button className="back-btn" onClick={onBack}>
        ← Back to Courses
      </button>
      <h1 className="calendar-title">📅 My Calendar</h1>
      <div />
    </div>
  );
};

export default CalendarHeader;