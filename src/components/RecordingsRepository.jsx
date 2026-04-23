import React, { useState } from "react";

const RecordingsRepository = ({ recordings, courses, onBack }) => {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const courseMap = {};
  courses.forEach((c) => {
    courseMap[c.id] = { name: c.name, code: c.code, color: c.color };
  });

  let filtered = recordings;

  if (courseFilter !== "all") {
    filtered = filtered.filter((r) => r.courseId === Number(courseFilter));
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter((r) => r.title.toLowerCase().includes(q));
  }

  filtered = [...filtered].sort((a, b) => {
    const da = new Date(a.date);
    const db = new Date(b.date);
    return sortOrder === "newest" ? db - da : da - db;
  });

  const uniqueCourses = [...new Set(recordings.map((r) => r.courseId))];

  return (
    <div className="recordings-repository">
      <div className="page-header">
        <div>
          <h1 className="page-title">Recordings Repository</h1>
          <p className="page-subtitle">
            {filtered.length} recordings across {uniqueCourses.length} courses
          </p>
        </div>
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
      </div>

      <div className="recordings-controls">
        <input
          className="recording-search"
          type="text"
          placeholder="Search recordings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="recordings-filter-select"
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
        >
          <option value="all">All Courses</option>
          {uniqueCourses.map((cId) => (
            <option key={cId} value={cId}>
              {courseMap[cId]?.code} – {courseMap[cId]?.name}
            </option>
          ))}
        </select>
        <select
          className="recordings-sort-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <div className="recordings-list">
        {filtered.length === 0 ? (
          <p className="empty-text">No recordings match your search.</p>
        ) : (
          filtered.map((rec) => {
            const course = courseMap[rec.courseId];
            return (
              <div className="recording-card" key={rec.id}>
                {course && (
                  <span
                    className="recording-course-tag"
                    style={{ color: course.color }}
                  >
                    {course.code} – {course.name}
                  </span>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>{rec.title}</strong>
                    <div className="recording-meta">
                      {rec.date} · {rec.duration}
                    </div>
                  </div>
                  <a
                    href={rec.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="recording-watch-btn"
                    style={{ background: course?.color || "#6366f1" }}
                  >
                    Watch
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecordingsRepository;
