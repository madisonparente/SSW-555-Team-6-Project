import React from "react";
import EventCard from "./EventCard";

const EventModal = ({ selectedDate, events, selectedFilter, onClose, getEventsForDate, getEventTypeColor, getEventTypeLabel }) => {
  if (!selectedDate) return null;

  const dateEvents = getEventsForDate(selectedDate);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            Events for {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-events">
          {dateEvents.length === 0 ? (
            <p className="no-events">No events on this date</p>
          ) : (
            dateEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                getEventTypeColor={getEventTypeColor}
                getEventTypeLabel={getEventTypeLabel}
                isModal={true}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;