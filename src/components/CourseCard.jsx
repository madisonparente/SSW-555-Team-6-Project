import Icon from "./Icon";

const CourseCard = ({ course, onClick }) => {
  const c = course;
  return (
    <div
      className="course-card"
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = c.color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#2a2d3e";
      }}
    >
      <div
        style={{
          height: 6,
          background: `linear-gradient(90deg, ${c.color}, ${c.color}88)`,
        }}
      />
      <div className="card-body">
        <div className="card-top">
          <div
            className="card-icon"
            style={{ background: c.color + "22", color: c.color }}
          >
            {c.code.slice(0, 2)}
          </div>
          <a
            href={c.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="join-badge"
            style={{ background: c.color + "22", color: c.color }}
          >
            <Icon type="video" size={14} /> Join
          </a>
        </div>
        <h3 className="card-title">{c.name}</h3>
        <p className="card-meta">
          {c.code} · {c.teacher}
        </p>
        <div className="card-info">
          <span>
            <Icon type="clock" size={13} /> {c.schedule}
          </span>
          <span>
            <Icon type="users" size={13} /> {c.students}
          </span>
        </div>
        {c.announcements.length > 0 && (
          <div
            className="card-announcement"
            style={{ borderLeft: `3px solid ${c.color}` }}
          >
            📌 {typeof c.announcements[0] === 'string' ? c.announcements[0] : c.announcements[0].text}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
