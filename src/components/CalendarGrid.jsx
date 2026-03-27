import React from "react";

const CalendarGrid = ({ currentDate, events, selectedFilter, selectedDate, onDateSelect, getEventsForDate, dayNames }) => {
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="calendar-day empty">
          ""
        </div>,
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateEvents = getEventsForDate(date);
      const hasEvents = dateEvents.length > 0;
      const hasOfficeHours = dateEvents.some(e => e.type === "office-hours");
      const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          className={`calendar-day ${hasEvents ? "has-events" : ""} ${isSelected ? "selected" : ""} ${hasOfficeHours ? "office-hour-day" : ""}`}
          onClick={() => onDateSelect(date)}
        >
          <div className="day-number">{day}</div>
          {hasEvents && <div className="event-indicators">{dateEvents.length} event{dateEvents.length > 1 ? 's' : ''}</div>}
        </div>,
      );
    }

    return days;
  };

  return (
    <div className="calendar-grid">
      <div className="calendar-header-days">
        {dayNames.map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-days">{renderCalendar()}</div>
    </div>
  );
};

export default CalendarGrid;