import { useState } from "react";
import Header from "./components/Header";
import CourseCard from "./components/CourseCard";
import CourseDetail from "./components/CourseDetail";
import NewCourseForm from "./components/NewCourseForm";
import CalendarView from "./components/CalendarView";
import INITIAL_COURSES from "./data/courses";
import INITIAL_QUIZZES from "./data/quizzes";
import USERS from "./data/users";
import EVENTS from "./data/events";
import "./App.css";

export default function App() {
  const [role, setRole] = useState("student");
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showNewCourse, setShowNewCourse] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [quizzes, setQuizzes] = useState(INITIAL_QUIZZES);
  const [studentResponses, setStudentResponses] = useState({});
  const [newCourse, setNewCourse] = useState({
    name: "",
    code: "",
    schedule: "",
    meetLink: "",
  });
  const user = USERS[role];

  const totalAnnouncements = courses.reduce(
    (sum, c) => sum + c.announcements.length,
    0,
  );

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setShowCalendar(false); // Close calendar when switching roles
  };

  const handleCalendarClick = () => {
    setShowCalendar(!showCalendar);
    setSelectedCourse(null);
  };

  const addCourse = () => {
    if (!newCourse.name || !newCourse.code) return;
    const colors = [
      "#6366f1",
      "#ec4899",
      "#f59e0b",
      "#10b981",
      "#8b5cf6",
      "#ef4444",
      "#06b6d4",
    ];
    setCourses((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...newCourse,
        teacher: user.name,
        color: colors[Math.floor(Math.random() * colors.length)],
        students: 0,
        announcements: [],
      },
    ]);
    setNewCourse({ name: "", code: "", schedule: "", meetLink: "" });
    setShowNewCourse(false);
  };

  const addAnnouncement = (courseId, text) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? { ...c, announcements: [text, ...c.announcements] }
          : c,
      ),
    );
  };

  const addFiles = (courseId, newFiles) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? { ...c, files: [...(c.files || []), ...newFiles] }
          : c,
      ),
    );
  };

  const createQuiz = (courseId, title, questions) => {
    setQuizzes((prev) => [
      ...prev,
      {
        id: Date.now(),
        courseId,
        title,
        status: "inactive",
        currentQuestionIndex: 0,
        questions: questions.map((q, i) => ({ ...q, id: Date.now() + i })),
      },
    ]);
  };

  const launchQuiz = (quizId) => {
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === quizId ? { ...q, status: "active", currentQuestionIndex: 0 } : q,
      ),
    );
    setStudentResponses((prev) => {
      const next = { ...prev };
      delete next[quizId];
      return next;
    });
  };

  const advanceQuestion = (quizId) => {
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === quizId
          ? { ...q, currentQuestionIndex: q.currentQuestionIndex + 1 }
          : q,
      ),
    );
  };

  const endQuiz = (quizId) => {
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === quizId ? { ...q, status: "finished" } : q,
      ),
    );
  };

  const submitAnswer = (quizId, questionId, selectedIndex) => {
    setStudentResponses((prev) => ({
      ...prev,
      [quizId]: { ...(prev[quizId] || {}), [questionId]: selectedIndex },
    }));
  };

  if (showCalendar && role === "student") {
    return (
      <div>
        <Header
          role={role}
          setRole={handleRoleChange}
          onCalendarClick={handleCalendarClick}
          showCalendar={showCalendar}
        />
        <CalendarView events={EVENTS} onBack={handleCalendarClick} />
      </div>
    );
  }

  if (selectedCourse) {
    const c = courses.find((x) => x.id === selectedCourse);
    if (!c) {
      setSelectedCourse(null);
      return null;
    }
    return (
      <div>
        <Header
          role={role}
          setRole={handleRoleChange}
          onCalendarClick={handleCalendarClick}
          showCalendar={showCalendar}
        />
        <CourseDetail
          course={c}
          role={role}
          onBack={() => setSelectedCourse(null)}
          onAddAnnouncement={addAnnouncement}
          onAddFiles={addFiles}
          quizzes={quizzes}
          studentResponses={studentResponses}
          onCreateQuiz={createQuiz}
          onLaunchQuiz={launchQuiz}
          onAdvanceQuestion={advanceQuestion}
          onEndQuiz={endQuiz}
          onSubmitAnswer={submitAnswer}
        />
      </div>
    );
  }

  return (
    <div>
      <Header
        role={role}
        setRole={handleRoleChange}
        onCalendarClick={handleCalendarClick}
        showCalendar={showCalendar}
      />
      <main className="main">
        <div className="page-header">
          <div>
            <h1 className="page-title">
              {role === "student" ? "My Courses" : "My Classes"}
            </h1>
            <p className="page-subtitle">
              {courses.length} courses · {totalAnnouncements} announcements
            </p>
          </div>
          {role === "teacher" && (
            <button
              className="new-course-btn"
              onClick={() => setShowNewCourse(true)}
            >
              + New Course
            </button>
          )}
        </div>
        {showNewCourse && (
          <NewCourseForm
            newCourse={newCourse}
            setNewCourse={setNewCourse}
            onSubmit={addCourse}
            onClose={() => setShowNewCourse(false)}
          />
        )}
        <div className="course-grid">
          {courses.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              onClick={() => setSelectedCourse(c.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
