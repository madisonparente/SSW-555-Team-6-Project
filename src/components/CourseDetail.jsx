import Icon from "./Icon";

const CourseDetail = ({ course, onBack, role }) => {
  const c = course;

  return (
    <div>
      <div
        className="detail-header"
        style={{
          background: c.color + "22",
          borderBottom: `2px solid ${c.color}44`,
        }}
      >
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <div className="detail-icon" style={{ background: c.color }}>
          {c.code[0]}
        </div>
        <div>
          <h1 className="detail-title">{c.name}</h1>
          <span className="detail-meta">
            {c.code} · {c.teacher} · {c.schedule}
          </span>
        </div>
      </div>
      <div className="detail-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value" style={{ color: c.color }}>
              {c.students}
            </div>
            <div className="stat-label">Students Enrolled</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: c.color }}>
              {c.announcements.length}
            </div>
            <div className="stat-label">Announcements</div>
          </div>
          <a
            href={c.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="join-card"
            style={{
              background: `linear-gradient(135deg, ${c.color}, ${c.color}bb)`,
            }}
          >
            <Icon type="video" size={28} />
            <span className="join-card-text">Join Live Class</span>
          </a>
        </div>
        <div className="announcements-panel">
          <h2 className="announcements-title">
            <Icon type="bell" /> Announcements
          </h2>
          {c.announcements.length === 0 ? (
            <p className="empty-text">No announcements yet.</p>
          ) : (
            c.announcements.map((a, i) => (
              <div
                key={i}
                className="announcement-item"
                style={{ borderLeft: `3px solid ${c.color}` }}
              >
                {a}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
