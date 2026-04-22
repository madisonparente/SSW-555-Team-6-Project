import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import CourseCard from "./components/CourseCard";
import CourseDetail from "./components/CourseDetail";
import NewCourseForm from "./components/NewCourseForm";
import CalendarView from "./components/CalendarView";
import StudentDashboard from "./components/StudentDashboard";
import StudySessionPanel from "./components/StudySessionPanel";
import RecordingsRepository from "./components/RecordingsRepository";
import USERS from "./data/users";
import * as coursesApi from "./api/coursesApi";
import * as eventsApi from "./api/eventsApi";
import * as quizzesApi from "./api/quizzesApi";
import * as recordingsApi from "./api/recordingsApi";
import * as quizResultsApi from "./api/quizResultsApi";
import * as discussionsApi from "./api/discussionsApi";
import * as studySessionsApi from "./api/studySessionsApi";
import "./App.css";

export default function App() {
  const [role, setRole] = useState("student");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showNewCourse, setShowNewCourse] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showStudyGroups, setShowStudyGroups] = useState(false);
  const [studySessions, setStudySessions] = useState([]);
  const [showRecordings, setShowRecordings] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [studentResponses, setStudentResponses] = useState({});
  const [events, setEvents] = useState([]);
  const [discussions, setDiscussions] = useState({});
  const [loading, setLoading] = useState(true);
  const [newCourse, setNewCourse] = useState({
    name: "",
    code: "",
    schedule: "",
    meetLink: "",
  });
  const [newEvent, setNewEvent] = useState({
    type: "",
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    meetLink: "",
  });
  const user = USERS[role];

  // Fetch all data on mount
  useEffect(() => {
    Promise.all([
      coursesApi.fetchCourses(),
      eventsApi.fetchEvents(),
      quizzesApi.fetchQuizzes(),
      recordingsApi.fetchRecordings(),
      quizResultsApi.fetchQuizResults(),
      studySessionsApi.fetchStudySessions(),
    ])
      .then(([c, e, q, r, qr, ss]) => {
        setCourses(c);
        setEvents(e);
        setQuizzes(q);
        setRecordings(r);
        setQuizResults(qr);
        setStudySessions(ss);
      })
      .catch((err) => console.error("Failed to load data:", err))
      .finally(() => setLoading(false));
  }, []);

  // Fetch discussions when selectedCourse changes
  const fetchDiscussionsForCourse = useCallback(async (courseId) => {
    try {
      const threads = await discussionsApi.fetchDiscussions(courseId);
      setDiscussions((prev) => ({ ...prev, [courseId]: threads }));
    } catch (err) {
      console.error("Failed to load discussions:", err);
    }
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchDiscussionsForCourse(selectedCourse);
    }
  }, [selectedCourse, fetchDiscussionsForCourse]);

  const totalAnnouncements = courses.reduce(
    (sum, c) => sum + c.announcements.length,
    0,
  );

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setShowCalendar(false);
    setShowDashboard(false);
    setShowRecordings(false);
    setShowStudyGroups(false);
  };

  const handleCalendarClick = () => {
    setShowCalendar((prev) => !prev);
    setShowDashboard(false);
    setShowStudyGroups(false);
    setShowRecordings(false);
    setSelectedCourse(null);
  };

  const handleDashboardClick = () => {
    setShowDashboard((prev) => !prev);
    setShowCalendar(false);
    setShowStudyGroups(false);
    setShowRecordings(false);
    setSelectedCourse(null);
  };

  const handleRecordingsClick = () => {
    setShowRecordings((prev) => !prev);
    setShowCalendar(false);
    setShowDashboard(false);
    setShowStudyGroups(false);
    setSelectedCourse(null);
  };

  const handleStudyGroupsClick = () => {
    setShowStudyGroups((prev) => !prev);
    setShowDashboard(false);
    setShowCalendar(false);
    setShowRecordings(false);
    setSelectedCourse(null);
  };

  const addStudySession = async (session) => {
    try {
      const saved = await studySessionsApi.createStudySession(session);
      setStudySessions((prev) => [saved, ...prev]);
    } catch (err) {
      console.error("Failed to create study session:", err);
    }
  };

  const addCourse = async () => {
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
    try {
      const saved = await coursesApi.createCourse({
        ...newCourse,
        teacher: user.name,
        color: colors[Math.floor(Math.random() * colors.length)],
        students: 0,
        announcements: [],
      });
      setCourses((prev) => [...prev, saved]);
      setNewCourse({ name: "", code: "", schedule: "", meetLink: "" });
      setShowNewCourse(false);
    } catch (err) {
      console.error("Failed to create course:", err);
    }
  };

  const addEvent = async () => {
    if (!newEvent.type || !newEvent.title || !newEvent.date) return;
    try {
      const saved = await eventsApi.createEvent({
        ...newEvent,
        courseId: null,
        courseName: "",
        courseCode: "",
        dayOfWeek: new Date(newEvent.date).toLocaleDateString('en-US', { weekday: 'long' }),
      });
      setEvents((prev) => [...prev, saved]);
      setNewEvent({
        type: "",
        title: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        meetLink: "",
      });
    } catch (err) {
      console.error("Failed to create event:", err);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await eventsApi.deleteEvent(eventId);
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
    } catch (err) {
      console.error("Failed to delete event:", err);
    }
  };

  const addAnnouncement = async (courseId, text) => {
    try {
      const updated = await coursesApi.addAnnouncement(courseId, text);
      setCourses((prev) => prev.map((c) => (c.id === courseId ? updated : c)));
    } catch (err) {
      console.error("Failed to add announcement:", err);
    }
  };

  const deleteAnnouncement = async (courseId, announcementId) => {
    try {
      const updated = await coursesApi.deleteAnnouncement(courseId, announcementId);
      setCourses((prev) => prev.map((c) => (c.id === courseId ? updated : c)));
    } catch (err) {
      console.error("Failed to delete announcement:", err);
    }
  };

  const addFiles = async (courseId, newFiles) => {
    try {
      const updated = await coursesApi.addFiles(courseId, newFiles);
      setCourses((prev) => prev.map((c) => (c.id === courseId ? updated : c)));
    } catch (err) {
      console.error("Failed to add files:", err);
    }
  };

  const createQuiz = async (courseId, title, questions) => {
    try {
      const saved = await quizzesApi.createQuiz({
        courseId,
        title,
        status: "inactive",
        currentQuestionIndex: 0,
        questions: questions.map((q) => ({ ...q })),
      });
      setQuizzes((prev) => [...prev, saved]);
    } catch (err) {
      console.error("Failed to create quiz:", err);
    }
  };

  const launchQuiz = async (quizId) => {
    try {
      const updated = await quizzesApi.launchQuiz(quizId);
      setQuizzes((prev) => prev.map((q) => (q.id === quizId ? updated : q)));
      setStudentResponses((prev) => {
        const next = { ...prev };
        delete next[quizId];
        return next;
      });
    } catch (err) {
      console.error("Failed to launch quiz:", err);
    }
  };

  const advanceQuestion = async (quizId) => {
    try {
      const updated = await quizzesApi.advanceQuiz(quizId);
      setQuizzes((prev) => prev.map((q) => (q.id === quizId ? updated : q)));
    } catch (err) {
      console.error("Failed to advance question:", err);
    }
  };

  const endQuiz = async (quizId) => {
    try {
      const updated = await quizzesApi.endQuiz(quizId);
      setQuizzes((prev) => prev.map((q) => (q.id === quizId ? updated : q)));
    } catch (err) {
      console.error("Failed to end quiz:", err);
    }
  };

  const addRecording = async (courseId, recording) => {
    try {
      const saved = await recordingsApi.createRecording({ ...recording, courseId });
      setRecordings((prev) => [saved, ...prev]);
    } catch (err) {
      console.error("Failed to add recording:", err);
    }
  };

  const submitAnswer = (quizId, questionId, selectedIndex) => {
    setStudentResponses((prev) => ({
      ...prev,
      [quizId]: { ...(prev[quizId] || {}), [questionId]: selectedIndex },
    }));
  };

  const saveQuizResult = async (result) => {
    try {
      const saved = await quizResultsApi.createQuizResult(result);
      setQuizResults((prev) => [...prev, saved]);
    } catch (err) {
      console.error("Failed to save quiz result:", err);
    }
  };

  const addThread = async (courseId, thread) => {
    try {
      const saved = await discussionsApi.createDiscussion({
        ...thread,
        courseId,
      });
      setDiscussions((prev) => ({
        ...prev,
        [courseId]: [saved, ...(prev[courseId] || [])],
      }));
    } catch (err) {
      console.error("Failed to add thread:", err);
    }
  };

  const addReply = async (courseId, threadId, reply) => {
    try {
      const updated = await discussionsApi.addReply(threadId, reply);
      setDiscussions((prev) => ({
        ...prev,
        [courseId]: (prev[courseId] || []).map((t) =>
          t.id === threadId ? updated : t,
        ),
      }));
    } catch (err) {
      console.error("Failed to add reply:", err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Loading ClassLink...</p>
      </div>
    );
  }

  if (showCalendar && role === "student") {
    return (
      <div>
        <Header
          role={role}
          setRole={handleRoleChange}
          onCalendarClick={handleCalendarClick}
          showCalendar={showCalendar}
          onDashboardClick={handleDashboardClick}
          showDashboard={showDashboard}
          onStudyGroupsClick={handleStudyGroupsClick}
          showStudyGroups={showStudyGroups}
          onRecordingsClick={handleRecordingsClick}
          showRecordings={showRecordings}
        />
        <CalendarView
          events={events}
          onBack={handleCalendarClick}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          addEvent={addEvent}
          deleteEvent={deleteEvent}
        />
      </div>
    );
  }

  if (showRecordings && role === "student") {
    return (
      <div>
        <Header
          role={role}
          setRole={handleRoleChange}
          onCalendarClick={handleCalendarClick}
          showCalendar={showCalendar}
          onDashboardClick={handleDashboardClick}
          showDashboard={showDashboard}
          onRecordingsClick={handleRecordingsClick}
          showRecordings={showRecordings}
        />
        <RecordingsRepository
          recordings={recordings}
          courses={courses}
          onBack={handleRecordingsClick}
        />
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
          onDashboardClick={handleDashboardClick}
          showDashboard={showDashboard}
          onStudyGroupsClick={handleStudyGroupsClick}
          showStudyGroups={showStudyGroups}
          onRecordingsClick={handleRecordingsClick}
          showRecordings={showRecordings}
        />
        <CourseDetail
          course={c}
          role={role}
          studentId={role === "student" ? 1 : null}
          onBack={() => setSelectedCourse(null)}
          onAddAnnouncement={addAnnouncement}
          onDeleteAnnouncement={deleteAnnouncement}
          onAddFiles={addFiles}
          quizzes={quizzes}
          studentResponses={studentResponses}
          onCreateQuiz={createQuiz}
          onLaunchQuiz={launchQuiz}
          onAdvanceQuestion={advanceQuestion}
          onEndQuiz={endQuiz}
          onSubmitAnswer={submitAnswer}
          onSaveResult={saveQuizResult}
          recordings={recordings}
          onAddRecording={addRecording}
          discussions={discussions}
          currentUser={user.name}
          onAddThread={addThread}
          onAddReply={addReply}
        />
      </div>
    );
  }

  const isStudentDashboardVisible = role === "student" && showDashboard;
  const isStudyGroupsVisible = role === "student" && showStudyGroups;

  return (
    <div>
      <Header
        role={role}
        setRole={handleRoleChange}
        onCalendarClick={handleCalendarClick}
        showCalendar={showCalendar}
        onDashboardClick={handleDashboardClick}
        showDashboard={showDashboard}
        onStudyGroupsClick={handleStudyGroupsClick}
        showStudyGroups={showStudyGroups}
        onRecordingsClick={handleRecordingsClick}
        showRecordings={showRecordings}
      />
      <main className="main">
        {isStudentDashboardVisible ? (
          <StudentDashboard
            studentId={1}
            events={events}
            results={quizResults}
            quizzes={quizzes}
            recordings={recordings}
            studentResponses={studentResponses}
          />
        ) : isStudyGroupsVisible ? (
          <StudySessionPanel
            courses={courses}
            currentUser={user.name}
            sessions={studySessions}
            onCreateSession={addStudySession}
          />
        ) : (
          <>
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
          </>
        )}
      </main>
    </div>
  );
}
