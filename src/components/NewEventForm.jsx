import Icon from "./Icon";

const EVENT_TYPES = [
  { value: "class", label: "Class Session" },
  { value: "tutoring", label: "Tutoring Session" },
  { value: "deadline", label: "Assignment Deadline" },
  { value: "office-hours", label: "Office Hours" },
  { value: "other", label: "Other" },
];

const FIELDS = [
  ["title", "Event Title", "e.g. CS101 Midterm Review"],
  ["date", "Date", "YYYY-MM-DD"],
  ["startTime", "Start Time", "e.g. 10:00 AM"],
  ["endTime", "End Time", "e.g. 11:30 AM"],
  ["location", "Location", "e.g. Online or Room 101"],
];

const NewEventForm = ({ newEvent, setNewEvent, onSubmit, onClose }) => {
  return (
    <div className="new-event-form">
      <div className="form-header">
        <h3>Add New Event</h3>
        <button className="form-close" onClick={onClose}>
          <Icon type="x" />
        </button>
      </div>
      <div className="form-grid">
        <div>
          <label className="form-label">Event Type</label>
          <select
            className="form-input"
            value={newEvent.type}
            onChange={(e) =>
              setNewEvent((p) => ({ ...p, type: e.target.value }))
            }
          >
            <option value="">Select Type</option>
            {EVENT_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        {FIELDS.map(([key, label, ph]) => (
          <div key={key}>
            <label className="form-label">{label}</label>
            <input
              className="form-input"
              type={key === "date" ? "date" : "text"}
              value={newEvent[key]}
              onChange={(e) =>
                setNewEvent((p) => ({ ...p, [key]: e.target.value }))
              }
              placeholder={ph}
            />
          </div>
        ))}
        <div>
          <label className="form-label">Meet Link (Optional)</label>
          <input
            className="form-input"
            value={newEvent.meetLink || ""}
            onChange={(e) =>
              setNewEvent((p) => ({ ...p, meetLink: e.target.value }))
            }
            placeholder="https://meet.google.com/..."
          />
        </div>
      </div>
      <button className="form-submit" onClick={onSubmit}>
        Add Event
      </button>
    </div>
  );
};

export default NewEventForm;