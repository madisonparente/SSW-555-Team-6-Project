import { useState } from "react";

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    " at " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

const AuthorBadge = ({ role }) =>
  role === "teacher" ? (
    <span className="discussion-instructor-badge">Instructor</span>
  ) : null;

const ThreadView = ({ thread, courseColor, currentUser, currentRole, onAddReply, onBack }) => {
  const [replyText, setReplyText] = useState("");

  const handleReply = () => {
    if (!replyText.trim()) return;
    onAddReply({
      id: Date.now(),
      body: replyText.trim(),
      author: currentUser,
      role: currentRole,
      createdAt: new Date().toISOString(),
    });
    setReplyText("");
  };

  return (
    <div>
      <button className="discussion-back-btn" onClick={onBack}>← Back to Discussions</button>

      <div className="discussion-thread-header" style={{ borderLeft: `4px solid ${courseColor}` }}>
        <div className="discussion-thread-title">{thread.title}</div>
        <div className="discussion-thread-meta">
          <span className="discussion-author">{thread.author}</span>
          <AuthorBadge role={thread.role} />
          <span className="discussion-date">{formatDate(thread.createdAt)}</span>
        </div>
        <p className="discussion-thread-body">{thread.body}</p>
      </div>

      <div className="discussion-replies-section">
        <h3 className="discussion-replies-heading">
          {thread.replies.length} {thread.replies.length === 1 ? "Reply" : "Replies"}
        </h3>

        {thread.replies.length === 0 && (
          <p className="empty-text">No replies yet. Be the first to respond!</p>
        )}

        {thread.replies.map((reply) => (
          <div
            key={reply.id}
            className="discussion-reply"
            style={{ borderLeft: `3px solid ${reply.role === "teacher" ? courseColor : "#2a2d3e"}` }}
          >
            <div className="discussion-reply-meta">
              <span className="discussion-author">{reply.author}</span>
              <AuthorBadge role={reply.role} />
              <span className="discussion-date">{formatDate(reply.createdAt)}</span>
            </div>
            <p className="discussion-reply-body">{reply.body}</p>
          </div>
        ))}

        <div className="discussion-reply-form">
          <textarea
            className="discussion-textarea"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={3}
          />
          <button
            className="discussion-submit-btn"
            style={{ background: courseColor }}
            onClick={handleReply}
            disabled={!replyText.trim()}
          >
            Post Reply
          </button>
        </div>
      </div>
    </div>
  );
};

const DiscussionBoard = ({ courseId, courseColor, threads, currentUser, currentRole, onAddThread, onAddReply }) => {
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  const courseThreads = threads[courseId] || [];
  const selectedThread = courseThreads.find((t) => t.id === selectedThreadId);

  const handleSubmitThread = () => {
    if (!newTitle.trim() || !newBody.trim()) return;
    onAddThread(courseId, {
      id: Date.now(),
      title: newTitle.trim(),
      body: newBody.trim(),
      author: currentUser,
      role: currentRole,
      createdAt: new Date().toISOString(),
      replies: [],
    });
    setNewTitle("");
    setNewBody("");
    setShowNewForm(false);
  };

  if (selectedThread) {
    return (
      <div className="announcements-panel">
        <h2 className="announcements-title">💬 Discussion Board</h2>
        <ThreadView
          thread={selectedThread}
          courseColor={courseColor}
          currentUser={currentUser}
          currentRole={currentRole}
          onAddReply={(reply) => onAddReply(courseId, selectedThread.id, reply)}
          onBack={() => setSelectedThreadId(null)}
        />
      </div>
    );
  }

  return (
    <div className="announcements-panel">
      <div className="discussion-board-header">
        <h2 className="announcements-title">💬 Discussion Board</h2>
        <button
          className="discussion-new-btn"
          style={{ background: courseColor }}
          onClick={() => setShowNewForm((v) => !v)}
        >
          {showNewForm ? "Cancel" : "+ New Thread"}
        </button>
      </div>

      {showNewForm && (
        <div className="discussion-new-form">
          <input
            className="announce-input"
            placeholder="Thread title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea
            className="discussion-textarea"
            placeholder="Describe your question or topic..."
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            rows={4}
          />
          <button
            className="discussion-submit-btn"
            style={{ background: courseColor }}
            onClick={handleSubmitThread}
            disabled={!newTitle.trim() || !newBody.trim()}
          >
            Post Thread
          </button>
        </div>
      )}

      {courseThreads.length === 0 ? (
        <p className="empty-text">No discussions yet. Start the conversation!</p>
      ) : (
        <div className="discussion-thread-list">
          {courseThreads.map((thread) => (
            <button
              key={thread.id}
              className="discussion-thread-card"
              style={{ borderLeft: `3px solid ${courseColor}` }}
              onClick={() => setSelectedThreadId(thread.id)}
            >
              <div className="discussion-thread-card-title">{thread.title}</div>
              <div className="discussion-thread-card-meta">
                <span className="discussion-author">{thread.author}</span>
                <AuthorBadge role={thread.role} />
                <span className="discussion-date">{formatDate(thread.createdAt)}</span>
                <span className="discussion-reply-count">
                  {thread.replies.length} {thread.replies.length === 1 ? "reply" : "replies"}
                </span>
              </div>
              <p className="discussion-thread-card-preview">{thread.body}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscussionBoard;
