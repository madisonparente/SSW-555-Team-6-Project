import React, { useState } from "react";

const CalendarView = ({ events, onBack }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 9)); // March 9, 2026
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const getEventsForDate = (date) => {
    const dateStr = formatDate(date.getFullYear(), date.getMonth(), date.getDate());
    return events.filter(
      (event) => event.date === dateStr && (selectedFilter === "all" || event.type === selectedFilter),
    );
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
      .filter(
        (event) =>
          new Date(event.date) >= today && (selectedFilter === "all" || event.type === selectedFilter),
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
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
      const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          className={`calendar-day ${hasEvents ? "has-events" : ""} ${isSelected ? "selected" : ""}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className="day-number">{day}</div>
          {hasEvents && <div className="event-indicators">{dateEvents.length} event(s)</div>}
        </div>,
      );
    }

    return days;
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case "class":
        return "#3b82f6";
      case "tutoring":
        return "#10b981";
      case "deadline":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getEventTypeLabel = (type) => {
    switch (type) {
      case "class":
        return "Class";
      case "tutoring":
        return "Tutoring";
      case "deadline":
        return "Deadline";
      default:
        return type;
    }
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button className="back-btn" onClick={onBack}>
          ← Back to Courses
        </button>
        <h1 className="calendar-title">📅 My Calendar</h1>
        <div />
      </div>

      <div className="calendar-container">
        <div className="calendar-section">
          <div className="month-navigation">
            <button onClick={handlePrevMonth} className="nav-btn">
              ← Previous
            </button>
            <h2 className="month-year">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button onClick={handleNextMonth} className="nav-btn">
              Next →
            </button>
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${selectedFilter === "all" ? "active" : ""}`}
              onClick={() => setSelectedFilter("all")}
            >
              All Events
            </button>
            <button
              className={`filter-btn ${selectedFilter === "class" ? "active" : ""}`}
              onClick={() => setSelectedFilter("class")}
            >
              Classes
            </button>
            <button
              className={`filter-btn ${selectedFilter === "tutoring" ? "active" : ""}`}
              onClick={() => setSelectedFilter("tutoring")}
            >
              Tutoring
            </button>
            <button
              className={`filter-btn ${selectedFilter === "deadline" ? "active" : ""}`}
              onClick={() => setSelectedFilter("deadline")}
            >
              Deadlines
            </button>
          </div>

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

          <div className="legend">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: "#3b82f6" }}></div>
              <span>Class Session</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: "#10b981" }}></div>
              <span>Tutoring Session</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: "#ef4444" }}></div>
              <span>Assignment Deadline</span>
            </div>
          </div>
        </div>

        <div className="upcoming-section">
          <div className="upcoming-header">
            <h2 className="upcoming-title">📌 Upcoming Events</h2>
          </div>
          <div className="events-list">
            {getUpcomingEvents().length === 0 ? (
              <p className="no-events">No upcoming events</p>
            ) : (
              getUpcomingEvents().map((event) => (
                <div key={event.id} className="event-card">
                  <div
                    className="event-type-bar"
                    style={{ backgroundColor: getEventTypeColor(event.type) }}
                  ></div>
                  <div className="event-content">
                    <div className="event-header">
                      <h3 className="event-title">{event.title}</h3>
                      <span className="event-type-badge" style={{ backgroundColor: getEventTypeColor(event.type) }}>
                        {getEventTypeLabel(event.type)}
                      </span>
                    </div>
                    <div className="event-date">
                      <strong>{event.date}</strong>
                    </div>
                    {event.type === "class" && (
                      <div className="event-details">
                        <div>
                          🕐 {event.startTime} - {event.endTime}
                        </div>
                        <div>📍 {event.location}</div>
                        {event.meetLink && (
                          <a href={event.meetLink} target="_blank" rel="noopener noreferrer" className="meet-link">
                            Join Meeting →
                          </a>
                        )}
                      </div>
                    )}
                    {event.type === "tutoring" && (
                      <div className="event-details">
                        <div>
                          🕐 {event.startTime} - {event.endTime}
                        </div>
                        <div>📍 {event.location}</div>
                        <div>👨‍🏫 Instructor: {event.instructor}</div>
                      </div>
                    )}
                    {event.type === "deadline" && (
                      <div className="event-details">
                        <div>⏰ Due: {event.dueTime}</div>
                        <div>📄 {event.description}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedDate && (
        <div className="modal-overlay" onClick={() => setSelectedDate(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                Events for {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </h2>
              <button className="modal-close" onClick={() => setSelectedDate(null)}>
                ✕
              </button>
            </div>
            <div className="modal-events">
              {getEventsForDate(selectedDate).length === 0 ? (
                <p className="no-events">No events on this date</p>
              ) : (
                getEventsForDate(selectedDate).map((event) => (
                  <div key={event.id} className="event-card modal-event-card">
                    <div
                      className="event-type-bar"
                      style={{ backgroundColor: getEventTypeColor(event.type) }}
                    ></div>
                    <div className="event-content">
                      <div className="event-header">
                        <h3 className="event-title">{event.title}</h3>
                        <span className="event-type-badge" style={{ backgroundColor: getEventTypeColor(event.type) }}>
                          {getEventTypeLabel(event.type)}
                        </span>
                      </div>
                      {event.type === "class" && (
                        <div className="event-details">
                          <div>
                            🕐 <strong>{event.startTime} - {event.endTime}</strong>
                          </div>
                          <div>📍 <strong>{event.location}</strong></div>
                          <div>👨‍🏫 {event.courseCode} - {event.courseName}</div>
                          {event.meetLink && (
                            <a href={event.meetLink} target="_blank" rel="noopener noreferrer" className="meet-link">
                              Join Meeting →
                            </a>
                          )}
                        </div>
                      )}
                      {event.type === "tutoring" && (
                        <div className="event-details">
                          <div>
                            🕐 <strong>{event.startTime} - {event.endTime}</strong>
                          </div>
                          <div>📍 <strong>{event.location}</strong></div>
                          <div>👨‍🏫 <strong>Instructor:</strong> {event.instructor}</div>
                          <div>📚 {event.courseName}</div>
                        </div>
                      )}
                      {event.type === "deadline" && (
                        <div className="event-details">
                          <div>⏰ <strong>Due:</strong> {event.dueTime}</div>
                          <div>📝 <strong>{event.courseName}</strong></div>
                          <div>📄 {event.description}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
