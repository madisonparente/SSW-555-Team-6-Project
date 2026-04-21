import React from "react";

const CalendarLegend = ({ getEventTypeColor }) => {
  const legendItems = [
    { type: "class", label: "Class Session" },
    { type: "tutoring", label: "Tutoring Session" },
    { type: "deadline", label: "Assignment Deadline" },
    { type: "office-hours", label: "Office Hours" },
    { type: "other", label: "Other" }
  ];

  return (
    <div className="legend">
      {legendItems.map(item => (
        <div key={item.type} className="legend-item">
          <div className="legend-color" style={{ backgroundColor: getEventTypeColor(item.type) }}></div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default CalendarLegend;