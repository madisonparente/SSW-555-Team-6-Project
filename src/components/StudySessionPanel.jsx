import React, { useState } from "react";

const SESSION_BASE_URL = "https://classlink.app/study/";

function generateSessionId() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 12; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

const TOPIC_OPTIONS = [
  "Exam Review",
  "Problem Set",
  "Project Collaboration",
  "Lecture Recap",
  "Open Discussion",
  "Other",
];

const StudySessionPanel = ({ courses, currentUser, sessions, onCreateSession }) => {
  const [showForm, setShowForm] = useState(false);
  const [topic, setTopic] = useState(TOPIC_OPTIONS[0]);
  const [customTopic, setCustomTopic] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(5);
  const [copiedId, setCopiedId] = useState(null);

  const handleCreate = () => {
    const resolvedTopic = topic === "Other" ? customTopic.trim() : topic;
    if (!resolvedTopic) return;

    const sessionId = generateSessionId();
    const link = `${SESSION_BASE_URL}${sessionId}`;
    const session = {
      id: sessionId,
      link,
      topic: resolvedTopic,
      description: description.trim(),
      courseId: courseId || null,
      maxParticipants: Number(maxParticipants),
      createdAt: new Date().toISOString(),
      host: currentUser,
    };

    onCreateSession(session);
    setTopic(TOPIC_OPTIONS[0]);
    setCustomTopic("");
    setDescription("");
    setCourseId("");
    setMaxParticipants(5);
    setShowForm(false);
  };

  const handleCopy = (session) => {
    const fallback = () => {
      const el = document.createElement("textarea");
      el.value = session.link;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopiedId(session.id);
      setTimeout(() => setCopiedId(null), 2000);
    };

    if (navigator.clipboard) {
      navigator.clipboard.writeText(session.link).then(() => {
        setCopiedId(session.id);
        setTimeout(() => setCopiedId(null), 2000);
      }).catch(fallback);
    } else {
      fallback();
    }
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCourseLabel = (id) => {
    const course = courses.find((c) => String(c.id) === String(id));
    return course ? `${course.code} — ${course.name}` : null;
  };

  return (
    <section className="study-session-panel">
      <div className="study-session-header">
        <div>
          <p className="dashboard-overline">Peer Collaboration</p>
          <h2 className="dashboard-title">Study Groups</h2>
          <p className="dashboard-subtitle">
            Generate a unique session link and share it with classmates to start a private study group.
          </p>
        </div>
        <button
          className="study-session-create-btn"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Cancel" : "+ New Session"}
        </button>
      </div>

      {showForm && (
        <div className="study-session-form-card">
          <h3 className="study-session-form-title">Create Study Session</h3>

          <div className="study-session-form-grid">
            <div className="study-field">
              <label className="study-label">Topic</label>
              <select
                className="study-input"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                {TOPIC_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {topic === "Other" && (
              <div className="study-field">
                <label className="study-label">Custom Topic</label>
                <input
                  className="study-input"
                  type="text"
                  placeholder="e.g. Data Structures Review"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  maxLength={60}
                />
              </div>
            )}

            <div className="study-field">
              <label className="study-label">Course (optional)</label>
              <select
                className="study-input"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              >
                <option value="">No specific course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="study-field">
              <label className="study-label">Max Participants</label>
              <input
                className="study-input"
                type="number"
                min={2}
                max={20}
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
              />
            </div>
          </div>

          <div className="study-field" style={{ marginTop: 0 }}>
            <label className="study-label">Description (optional)</label>
            <textarea
              className="study-input study-textarea"
              placeholder="What will you cover? Any prep required?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              rows={3}
            />
          </div>

          <button
            className="study-session-submit-btn"
            onClick={handleCreate}
            disabled={topic === "Other" && !customTopic.trim()}
          >
            Generate Session Link
          </button>
        </div>
      )}

      {sessions.length === 0 ? (
        <div className="study-session-empty">
          <p>No study sessions yet. Create one to get a shareable link.</p>
        </div>
      ) : (
        <div className="study-session-list">
          {sessions
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((session) => (
              <div key={session.id} className="study-session-card">
                <div className="study-session-card-top">
                  <div>
                    <h4 className="study-session-topic">{session.topic}</h4>
                    {session.courseId && (
                      <span className="study-session-course-tag">
                        {getCourseLabel(session.courseId)}
                      </span>
                    )}
                    {session.description && (
                      <p className="study-session-desc">{session.description}</p>
                    )}
                  </div>
                  <div className="study-session-meta-right">
                    <span className="study-session-participants">
                      👥 Up to {session.maxParticipants}
                    </span>
                    <span className="study-session-date">
                      {formatDate(session.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="study-session-link-row">
                  <span className="study-session-link-text">{session.link}</span>
                  <button
                    className={`study-session-copy-btn ${copiedId === session.id ? "copied" : ""}`}
                    onClick={() => handleCopy(session)}
                  >
                    {copiedId === session.id ? "Copied!" : "Copy Link"}
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </section>
  );
};

export default StudySessionPanel;
