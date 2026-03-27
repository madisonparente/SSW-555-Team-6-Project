import React from "react";

const CalendarLegend = ({ getEventTypeColor }) => {
  const legendItems = [
    { type: "class", label: "Class Session", color: "#3b82f6" },
    { type: "tutoring", label: "Tutoring Session", color: "#10b981" },
    { type: "deadline", label: "Assignment Deadline", color: "#ef4444" },
    { type: "office-hours", label: "Office Hours", color: "#8b5cf6" }
  ];

  return (
    <div className="legend">
      {legendItems.map(item => (
        <div key={item.type} className="legend-item">
          <div className="legend-color" style={{ backgroundColor: item.color }}></div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default CalendarLegend;