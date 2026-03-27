import React from "react";

const EventCard = ({ event, getEventTypeColor, getEventTypeLabel, isModal = false }) => {
  const renderEventDetails = () => {
    switch (event.type) {
      case "class":
        return (
          <div className="event-details">
            <div>
              🕐 {isModal ? <strong>{event.startTime} - {event.endTime}</strong> : `${event.startTime} - ${event.endTime}`}
            </div>
            <div>📍 {isModal ? <strong>{event.location}</strong> : event.location}</div>
            {isModal && <div>👨‍🏫 {event.courseCode} - {event.courseName}</div>}
            {event.meetLink && (
              <a href={event.meetLink} target="_blank" rel="noopener noreferrer" className="meet-link">
                Join Meeting →
              </a>
            )}
          </div>
        );
      case "tutoring":
        return (
          <div className="event-details">
            <div>
              🕐 {isModal ? <strong>{event.startTime} - {event.endTime}</strong> : `${event.startTime} - ${event.endTime}`}
            </div>
            <div>📍 {isModal ? <strong>{event.location}</strong> : event.location}</div>
            <div>👨‍🏫 {isModal ? <strong>Instructor:</strong> : ""} {event.instructor}</div>
            {isModal && <div>📚 {event.courseName}</div>}
          </div>
        );
      case "deadline":
        return (
          <div className="event-details">
            <div>⏰ {isModal ? <strong>Due:</strong> : "Due:"} {event.dueTime}</div>
            {isModal && <div>📝 <strong>{event.courseName}</strong></div>}
            <div>📄 {event.description}</div>
          </div>
        );
      case "office-hours":
        return (
          <div className="event-details">
            <div>🕐 {isModal ? <strong>{event.startTime} - {event.endTime}</strong> : `${event.startTime} - ${event.endTime}`}</div>
            <div>📍 {isModal ? <strong>{event.location}</strong> : event.location}</div>
            {isModal && <div>👨‍🏫 <strong>Instructor:</strong> {event.instructor}</div>}
            <a
              href={event.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className={isModal ? "schedule-btn" : "meet-link"}
              style={isModal ? {
                display: 'block',
                textAlign: 'center',
                backgroundColor: '#8b5cf6',
                color: 'white',
                padding: '8px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 'bold',
                marginTop: '10px'
              } : { color: '#8b5cf6' }}
            >
              📅 Schedule Session →
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`event-card ${isModal ? 'modal-event-card' : ''}`}>
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
        {!isModal && (
          <div className="event-date">
            <strong>{event.date}</strong>
          </div>
        )}
        {renderEventDetails()}
      </div>
    </div>
  );
};

export default EventCard;