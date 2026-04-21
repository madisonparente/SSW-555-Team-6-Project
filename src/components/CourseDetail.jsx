import React, { useState, useRef } from "react";
import Icon from "./Icon";
import QuizPanel from "./QuizPanel";
import RecordingsPanel from "./RecordingsPanel";

const FILE_ICONS = {
  pdf: "📄",
  doc: "📝",
  docx: "📝",
  ppt: "📊",
  pptx: "📊",
  xls: "📈",
  xlsx: "📈",
  jpg: "🖼️",
  png: "🖼️",
  zip: "📦",
  mp4: "🎬",
  default: "📎",
};

const getFileIcon = (name) => {
  const ext = name.split(".").pop().toLowerCase();
  return FILE_ICONS[ext] || FILE_ICONS.default;
};

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
};

const CourseDetail = ({
  course,
  studentId,
  onSaveResult,
  onBack,
  role,
  onAddAnnouncement,
  onDeleteAnnouncement,
  onAddFiles,
  quizzes,
  studentResponses,
  onCreateQuiz,
  onLaunchQuiz,
  onAdvanceQuestion,
  onEndQuiz,
  onSubmitAnswer,
  recordings,
  onAddRecording,
}) => {
  const c = course;
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handlePost = () => {
    if (!newAnnouncement.trim()) return;
    onAddAnnouncement(c.id, newAnnouncement);
    setNewAnnouncement("");
  };

  const processFiles = (fileList) => {
    const files = Array.from(fileList).map((f) => ({
      id: Date.now() + Math.random(),
      name: f.name,
      size: f.size,
      type: f.type,
      url: URL.createObjectURL(f),
      uploadedAt: new Date().toLocaleDateString(),
    }));
    onAddFiles(c.id, files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

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

        {/* Course Materials */}
        <div className="announcements-panel" style={{ marginBottom: 24 }}>
          <h2 className="announcements-title">📁 Course Materials</h2>

          {role === "teacher" && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={() => setDragging(false)}
              onClick={() => fileInputRef.current.click()}
              style={{
                border: `2px dashed ${dragging ? c.color : "#2a2d3e"}`,
                borderRadius: 10,
                padding: "28px 20px",
                textAlign: "center",
                cursor: "pointer",
                marginBottom: 16,
                background: dragging ? c.color + "11" : "#0f1117",
                transition: "all 0.2s",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files.length) processFiles(e.target.files);
                  e.target.value = "";
                }}
              />
              <div style={{ fontSize: 28, marginBottom: 8 }}>
                {dragging ? "📥" : "📤"}
              </div>
              <p
                style={{
                  color: dragging ? c.color : "#94a3b8",
                  fontSize: 14,
                  margin: 0,
                }}
              >
                {dragging
                  ? "Drop files here"
                  : "Drag & drop files or click to browse"}
              </p>
            </div>
          )}

          {!c.files || c.files.length === 0 ? (
            <p className="empty-text">No materials uploaded yet.</p>
          ) : (
            c.files.map((f) => (
              <a
                key={f.id}
                href={f.url}
                download={f.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  background: "#0f1117",
                  borderRadius: 8,
                  marginBottom: 8,
                  textDecoration: "none",
                  color: "#e2e8f0",
                  borderLeft: `3px solid ${c.color}`,
                }}
              >
                <span style={{ fontSize: 22 }}>{getFileIcon(f.name)}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{f.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    {formatSize(f.size)} · {f.uploadedAt}
                  </div>
                </div>
                <span style={{ color: c.color, fontSize: 13, fontWeight: 600 }}>
                  Download
                </span>
              </a>
            ))
          )}
        </div>

        {/* Recordings */}
        <RecordingsPanel
          recordings={(recordings || []).filter((r) => r.courseId === c.id)}
          role={role}
          courseColor={c.color}
          onAddRecording={(rec) => onAddRecording(c.id, rec)}
        />

        {/* Quizzes */}
        <QuizPanel
          role={role}
          studentId={studentId}
          courseId={c.id}
          quizzes={quizzes}
          studentResponses={studentResponses}
          onCreateQuiz={onCreateQuiz}
          onLaunchQuiz={onLaunchQuiz}
          onAdvanceQuestion={onAdvanceQuestion}
          onEndQuiz={onEndQuiz}
          onSubmitAnswer={onSubmitAnswer}
          onSaveResult={onSaveResult}
          recordings={(recordings || []).filter((r) => r.courseId === c.id)}
        />

        {/* Announcements */}
        <div className="announcements-panel">
          <h2 className="announcements-title">
            <Icon type="bell" /> Announcements
          </h2>
          {role === "teacher" && (
            <div className="announce-row">
              <input
                className="announce-input"
                value={newAnnouncement}
                onChange={(e) => setNewAnnouncement(e.target.value)}
                placeholder="Post an announcement..."
                onKeyDown={(e) => e.key === "Enter" && handlePost()}
              />
              <button
                className="announce-btn"
                style={{ background: c.color }}
                onClick={handlePost}
              >
                Post
              </button>
            </div>
          )}
          {c.announcements.length === 0 ? (
            <p className="empty-text">No announcements yet.</p>
          ) : (
            c.announcements.map((a, i) => {
              const announcementId = typeof a === 'string' ? null : a.id;
              const announcementText = typeof a === 'string' ? a : a.text;
              return (
                <div
                  key={i}
                  className="announcement-item"
                  style={{ borderLeft: `3px solid ${c.color}` }}
                >
                  <div className="announcement-content">
                    <span>{announcementText}</span>
                    {role === "teacher" && announcementId && onDeleteAnnouncement && (
                      <button
                        className="delete-announcement-btn"
                        onClick={() => onDeleteAnnouncement(c.id, announcementId)}
                        title="Delete announcement"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
