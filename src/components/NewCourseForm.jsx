import Icon from "./Icon";

const FIELDS = [
  ["name", "Course Name", "e.g. Intro to Biology"],
  ["code", "Course Code", "e.g. BIO101"],
  ["schedule", "Schedule", "e.g. Mon/Wed 2:00 PM"],
  ["meetLink", "Google Meet Link", "https://meet.google.com/..."],
];

const NewCourseForm = ({ newCourse, setNewCourse, onSubmit, onClose }) => {
  return (
    <div className="new-course-form">
      <div className="form-header">
        <h3>Create New Course</h3>
        <button className="form-close" onClick={onClose}>
          <Icon type="x" />
        </button>
      </div>
      <div className="form-grid">
        {FIELDS.map(([key, label, ph]) => (
          <div key={key}>
            <label className="form-label">{label}</label>
            <input
              className="form-input"
              value={newCourse[key]}
              onChange={(e) =>
                setNewCourse((p) => ({ ...p, [key]: e.target.value }))
              }
              placeholder={ph}
            />
          </div>
        ))}
      </div>
      <button className="form-submit" onClick={onSubmit}>
        Create Course
      </button>
    </div>
  );
};

export default NewCourseForm;
