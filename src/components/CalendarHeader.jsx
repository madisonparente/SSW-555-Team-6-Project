import React from "react";

const CalendarHeader = ({ onBack, onAddEvent }) => {
  return (
    <div className="calendar-header">
      <button className="back-btn" onClick={onBack}>
        ← Back to Courses
      </button>
      <h1 className="calendar-title">📅 My Calendar</h1>
      <button className="add-event-btn" onClick={onAddEvent}>
        + Add Event
      </button>
    </div>
  );
};

export default CalendarHeader;