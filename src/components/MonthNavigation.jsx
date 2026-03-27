import React from "react";

const MonthNavigation = ({ currentDate, monthNames, onPrevMonth, onNextMonth }) => {
  return (
    <div className="month-navigation">
      <button onClick={onPrevMonth} className="nav-btn">
        ← Previous
      </button>
      <h2 className="month-year">
        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
      </h2>
      <button onClick={onNextMonth} className="nav-btn">
        Next →
      </button>
    </div>
  );
};

export default MonthNavigation;