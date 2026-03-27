import React from "react";
import EventCard from "./EventCard";

const UpcomingEvents = ({ events, selectedFilter, getEventTypeColor, getEventTypeLabel }) => {
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

  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="upcoming-section">
      <div className="upcoming-header">
        <h2 className="upcoming-title">📌 Upcoming Events</h2>
      </div>
      <div className="events-list">
        {upcomingEvents.length === 0 ? (
          <p className="no-events">No upcoming events</p>
        ) : (
          upcomingEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              getEventTypeColor={getEventTypeColor}
              getEventTypeLabel={getEventTypeLabel}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingEvents;