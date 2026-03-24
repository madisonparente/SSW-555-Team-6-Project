import React, { useState } from "react";

const RecordingsPanel = ({ recordings, role, courseColor, onAddRecording }) => {
  const [search, setSearch] = useState("");
  const [newRec, setNewRec] = useState({
    title: "",
    videoUrl: "",
    date: "",
    duration: "",
    description: "",
  });

  const filtered = recordings.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSubmit = () => {
    if (!newRec.title || !newRec.videoUrl) return;
    onAddRecording({
      id: Date.now(),
      title: newRec.title,
      videoUrl: newRec.videoUrl,
      date: newRec.date || new Date().toISOString().split("T")[0],
      duration: newRec.duration || "N/A",
      description: newRec.description,
    });
    setNewRec({ title: "", videoUrl: "", date: "", duration: "", description: "" });
  };

  return (
    <div className="announcements-panel" style={{ marginBottom: 24 }}>
      <h2 className="announcements-title">🎥 Class Recordings</h2>

      {role === "teacher" && (
        <div className="recording-form">
          <div className="form-grid" style={{ marginBottom: 12 }}>
            <div>
              <label className="form-label">Title *</label>
              <input
                className="form-input"
                placeholder="Recording title"
                value={newRec.title}
                onChange={(e) => setNewRec({ ...newRec, title: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Video URL *</label>
              <input
                className="form-input"
                placeholder="https://..."
                value={newRec.videoUrl}
                onChange={(e) => setNewRec({ ...newRec, videoUrl: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Date</label>
              <input
                className="form-input"
                type="date"
                value={newRec.date}
                onChange={(e) => setNewRec({ ...newRec, date: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Duration</label>
              <input
                className="form-input"
                placeholder="e.g. 50 min"
                value={newRec.duration}
                onChange={(e) => setNewRec({ ...newRec, duration: e.target.value })}
              />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="form-label">Description</label>
            <input
              className="form-input"
              placeholder="Brief description of the recording"
              value={newRec.description}
              onChange={(e) => setNewRec({ ...newRec, description: e.target.value })}
            />
          </div>
          <button
            className="recording-watch-btn"
            style={{ background: courseColor }}
            onClick={handleSubmit}
          >
            Add Recording
          </button>
        </div>
      )}

      <input
        className="recording-search"
        placeholder="Search recordings..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <p className="empty-text">
          {search ? "No recordings match your search." : "No recordings yet."}
        </p>
      ) : (
        filtered.map((r) => (
          <div
            key={r.id}
            className="recording-card"
            style={{ borderLeft: `3px solid ${courseColor}` }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{r.title}</div>
                <div className="recording-meta">
                  {r.date} · {r.duration}
                </div>
                {r.description && (
                  <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
                    {r.description}
                  </div>
                )}
              </div>
              <a
                href={r.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="recording-watch-btn"
                style={{ background: courseColor }}
              >
                Watch
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RecordingsPanel;
