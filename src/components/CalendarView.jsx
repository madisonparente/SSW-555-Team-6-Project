import React, { useState } from "react";
import CalendarHeader from "./CalendarHeader";
import MonthNavigation from "./MonthNavigation";
import FilterButtons from "./FilterButtons";
import CalendarGrid from "./CalendarGrid";
import CalendarLegend from "./CalendarLegend";
import UpcomingEvents from "./UpcomingEvents";
import EventModal from "./EventModal";
import NewEventForm from "./NewEventForm";

const CalendarView = ({ events, onBack, newEvent, setNewEvent, addEvent, deleteEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showNewEventForm, setShowNewEventForm] = useState(false);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
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

  const getEventTypeColor = (type) => {
    switch (type) {
      case "class": return "#3b82f6";
      case "tutoring": return "#10b981";
      case "deadline": return "#ef4444";
      case "office-hours": return "#8b5cf6";
      case "other": return "#6b7280";
      default: return "#6b7280";
    }
  };

  const getEventTypeLabel = (type) => {
    switch (type) {
      case "class": return "Class";
      case "tutoring": return "Tutoring";
      case "deadline": return "Deadline";
      case "office-hours": return "Office Hours";
      case "other": return "Other";
      default: return type;
    }
  };

  return (
    <div className="calendar-view">
      <CalendarHeader onBack={onBack} onAddEvent={() => setShowNewEventForm(true)} />

      <div className="calendar-container">
        <div className="calendar-section">
          <MonthNavigation
            currentDate={currentDate}
            monthNames={monthNames}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />

          <FilterButtons
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />

          <CalendarGrid
            currentDate={currentDate}
            events={events}
            selectedFilter={selectedFilter}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            getEventsForDate={getEventsForDate}
            dayNames={dayNames}
          />

          <CalendarLegend getEventTypeColor={getEventTypeColor} />
        </div>

        <UpcomingEvents
          events={events}
          selectedFilter={selectedFilter}
          getEventTypeColor={getEventTypeColor}
          getEventTypeLabel={getEventTypeLabel}
        />
      </div>

      <EventModal
        selectedDate={selectedDate}
        events={events}
        selectedFilter={selectedFilter}
        onClose={() => setSelectedDate(null)}
        getEventsForDate={getEventsForDate}
        getEventTypeColor={getEventTypeColor}
        getEventTypeLabel={getEventTypeLabel}
        onDeleteEvent={deleteEvent}
      />

      {showNewEventForm && (
        <div className="modal-overlay" onClick={() => setShowNewEventForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <NewEventForm
              newEvent={newEvent}
              setNewEvent={setNewEvent}
              onSubmit={() => {
                addEvent();
                setShowNewEventForm(false);
              }}
              onClose={() => setShowNewEventForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
