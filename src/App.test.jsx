import { render, screen, fireEvent, within, waitFor } from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom";

// ── Mock data (mirrors original src/data files) ──

const MOCK_COURSES = [
  { id: "c1", name: "Intro to Computer Science", code: "CS101", teacher: "Dr. Smith", meetLink: "https://meet.google.com/abc-defg-hij", color: "#6366f1", schedule: "Mon/Wed 10:00 AM", students: 28, announcements: [{ id: "a1", text: "Midterm moved to March 15" }, { id: "a2", text: "Lab 3 due Friday" }], files: [] },
  { id: "c2", name: "Calculus II", code: "MATH201", teacher: "Prof. Johnson", meetLink: "https://meet.google.com/klm-nopq-rst", color: "#ec4899", schedule: "Tue/Thu 1:00 PM", students: 35, announcements: [{ id: "a3", text: "Chapter 7 homework posted" }], files: [] },
  { id: "c3", name: "World History", code: "HIST110", teacher: "Dr. Garcia", meetLink: "https://meet.google.com/uvw-xyza-bcd", color: "#f59e0b", schedule: "Mon/Wed/Fri 9:00 AM", students: 42, announcements: [], files: [] },
  { id: "c4", name: "Organic Chemistry", code: "CHEM301", teacher: "Prof. Lee", meetLink: "https://meet.google.com/efg-hijk-lmn", color: "#10b981", schedule: "Tue/Thu 3:00 PM", students: 22, announcements: [{ id: "a4", text: "Lab safety quiz Monday" }, { id: "a5", text: "Office hours moved to 4 PM" }], files: [] },
];

const MOCK_EVENTS = [
  { id: "e1", courseId: "c1", courseName: "Intro to Computer Science", courseCode: "CS101", type: "class", title: "CS101 - Class Session", date: "2026-03-10", startTime: "10:00 AM", endTime: "11:30 AM", dayOfWeek: "Monday", location: "Online", meetLink: "https://meet.google.com/abc-defg-hij", attended: true },
  { id: "e2", courseId: "c1", courseName: "Intro to Computer Science", courseCode: "CS101", type: "class", title: "CS101 - Class Session", date: "2026-03-12", startTime: "10:00 AM", endTime: "11:30 AM", dayOfWeek: "Wednesday", location: "Online", meetLink: "https://meet.google.com/abc-defg-hij", attended: true },
  { id: "e3", courseId: "c2", courseName: "Calculus II", courseCode: "MATH201", type: "class", title: "MATH201 - Class Session", date: "2026-03-11", startTime: "1:00 PM", endTime: "2:30 PM", dayOfWeek: "Tuesday", location: "Online", meetLink: "https://meet.google.com/klm-nopq-rst", attended: true },
  { id: "e4", courseId: "c2", courseName: "Calculus II", courseCode: "MATH201", type: "class", title: "MATH201 - Class Session", date: "2026-03-13", startTime: "1:00 PM", endTime: "2:30 PM", dayOfWeek: "Thursday", location: "Online", meetLink: "https://meet.google.com/klm-nopq-rst", attended: false },
  { id: "e5", courseId: "c3", courseName: "World History", courseCode: "HIST110", type: "class", title: "HIST110 - Class Session", date: "2026-03-10", startTime: "9:00 AM", endTime: "10:30 AM", dayOfWeek: "Monday", location: "Room 205", meetLink: "https://meet.google.com/uvw-xyza-bcd", attended: true },
  { id: "e6", courseId: "c3", courseName: "World History", courseCode: "HIST110", type: "class", title: "HIST110 - Class Session", date: "2026-03-12", startTime: "9:00 AM", endTime: "10:30 AM", dayOfWeek: "Wednesday", location: "Room 205", meetLink: "https://meet.google.com/uvw-xyza-bcd", attended: true },
  { id: "e7", courseId: "c3", courseName: "World History", courseCode: "HIST110", type: "class", title: "HIST110 - Class Session", date: "2026-03-14", startTime: "9:00 AM", endTime: "10:30 AM", dayOfWeek: "Friday", location: "Room 205", meetLink: "https://meet.google.com/uvw-xyza-bcd", attended: false },
  { id: "e8", courseId: "c4", courseName: "Organic Chemistry", courseCode: "CHEM301", type: "class", title: "CHEM301 - Class Session", date: "2026-03-11", startTime: "3:00 PM", endTime: "4:30 PM", dayOfWeek: "Tuesday", location: "Lab 101", meetLink: "https://meet.google.com/efg-hijk-lmn", attended: false },
  { id: "e9", courseId: "c4", courseName: "Organic Chemistry", courseCode: "CHEM301", type: "class", title: "CHEM301 - Class Session", date: "2026-03-13", startTime: "3:00 PM", endTime: "4:30 PM", dayOfWeek: "Thursday", location: "Lab 101", meetLink: "https://meet.google.com/efg-hijk-lmn", attended: true },
  { id: "e10", courseId: "c1", courseName: "Intro to Computer Science", courseCode: "CS101", type: "tutoring", title: "CS101 - Tutoring Session", date: "2026-03-15", startTime: "2:00 PM", endTime: "3:00 PM", dayOfWeek: "Saturday", location: "Library - Room 103", attended: false },
  { id: "e13", courseId: "c1", courseName: "Intro to Computer Science", courseCode: "CS101", type: "deadline", title: "CS101 - Programming Assignment 2 Due", date: "2026-03-14", dueTime: "11:59 PM", description: "Submit via GitHub", attended: false },
];

const MOCK_QUIZZES = [
  {
    id: "q1", courseId: "c1", title: "CS101 Midterm Review", status: "inactive", currentQuestionIndex: 0,
    questions: [
      { id: "qu1", text: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], correctIndex: 1, topics: ["binary-search", "time-complexity"] },
      { id: "qu2", text: "Which data structure uses FIFO ordering?", options: ["Stack", "Queue", "Tree", "Graph"], correctIndex: 1, topics: ["queues", "data-structures"] },
      { id: "qu3", text: "What does CPU stand for?", options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Processing Unit"], correctIndex: 0, topics: ["hardware-basics"] },
    ],
  },
  {
    id: "q2", courseId: "c2", title: "MATH201 Integration Quiz", status: "inactive", currentQuestionIndex: 0,
    questions: [
      { id: "qu4", text: "What is the integral of 2x?", options: ["x²", "x² + C", "2x² + C", "x + C"], correctIndex: 1, topics: ["integration", "basic-integrals"] },
      { id: "qu5", text: "Which technique is used for ∫x·eˣ dx?", options: ["Substitution", "Integration by parts", "Partial fractions", "Trigonometric substitution"], correctIndex: 1, topics: ["integration-by-parts", "integration-techniques"] },
    ],
  },
];

const MOCK_RECORDINGS = [
  { id: "r1", courseId: "c1", title: "Intro to Algorithms & Big-O Notation", date: "2025-03-10", duration: "52 min", videoUrl: "https://www.youtube.com/watch?v=example1", description: "Covers time complexity basics.", topics: ["time-complexity", "algorithms"] },
  { id: "r2", courseId: "c1", title: "Data Structures: Linked Lists & Stacks", date: "2025-03-12", duration: "48 min", videoUrl: "https://www.youtube.com/watch?v=example2", description: "Walkthrough of linked list operations.", topics: ["data-structures", "queues"] },
  { id: "r3", courseId: "c2", title: "Integration by Parts", date: "2025-03-11", duration: "55 min", videoUrl: "https://www.youtube.com/watch?v=example3", description: "Detailed examples of integration by parts.", topics: ["integration-by-parts", "integration-techniques", "integration"] },
  { id: "r4", courseId: "c2", title: "Taylor Series Expansion", date: "2025-03-14", duration: "60 min", videoUrl: "https://www.youtube.com/watch?v=example4", description: "Deriving Taylor and Maclaurin series.", topics: ["taylor-series"] },
  { id: "r5", courseId: "c3", title: "The French Revolution – Causes & Key Events", date: "2025-03-09", duration: "45 min", videoUrl: "https://www.youtube.com/watch?v=example5", description: "Overview of the French Revolution.", topics: ["french-revolution", "political-history"] },
  { id: "r6", courseId: "c3", title: "Industrial Revolution & Its Global Impact", date: "2025-03-13", duration: "50 min", videoUrl: "https://www.youtube.com/watch?v=example6", description: "Technological advances.", topics: ["industrial-revolution", "economic-history"] },
  { id: "r7", courseId: "c4", title: "Stereochemistry & Chirality", date: "2025-03-10", duration: "58 min", videoUrl: "https://www.youtube.com/watch?v=example7", description: "R/S configuration.", topics: ["stereochemistry", "chirality"] },
  { id: "r8", courseId: "c4", title: "Nucleophilic Substitution Reactions (SN1 & SN2)", date: "2025-03-14", duration: "63 min", videoUrl: "https://www.youtube.com/watch?v=example8", description: "Mechanism comparison.", topics: ["nucleophilic-substitution", "reaction-mechanisms"] },
];

const MOCK_RESULTS = [
  { id: "res1", studentId: 1, quizId: "q1", title: "CS101 Midterm Review", score: 8, total: 10, percentage: 80 },
  { id: "res2", studentId: 1, quizId: "q2", title: "MATH201 Integration Quiz", score: 6, total: 8, percentage: 75 },
];

// ── Mock all API modules ──

jest.mock("./api/coursesApi", () => ({
  fetchCourses: jest.fn(),
  createCourse: jest.fn(),
  fetchCourse: jest.fn(),
  addAnnouncement: jest.fn(),
  deleteAnnouncement: jest.fn(),
  addFiles: jest.fn(),
}));

jest.mock("./api/eventsApi", () => ({
  fetchEvents: jest.fn(),
  createEvent: jest.fn(),
  deleteEvent: jest.fn(),
}));

jest.mock("./api/quizzesApi", () => ({
  fetchQuizzes: jest.fn(),
  createQuiz: jest.fn(),
  launchQuiz: jest.fn(),
  advanceQuiz: jest.fn(),
  endQuiz: jest.fn(),
}));

jest.mock("./api/recordingsApi", () => ({
  fetchRecordings: jest.fn(),
  createRecording: jest.fn(),
}));

jest.mock("./api/quizResultsApi", () => ({
  fetchQuizResults: jest.fn(),
  createQuizResult: jest.fn(),
}));

jest.mock("./api/discussionsApi", () => ({
  fetchDiscussions: jest.fn(),
  createDiscussion: jest.fn(),
  addReply: jest.fn(),
}));

jest.mock("./api/studySessionsApi", () => ({
  fetchStudySessions: jest.fn(),
  createStudySession: jest.fn(),
}));

const coursesApi = require("./api/coursesApi");
const eventsApi = require("./api/eventsApi");
const quizzesApi = require("./api/quizzesApi");
const recordingsApi = require("./api/recordingsApi");
const quizResultsApi = require("./api/quizResultsApi");
const discussionsApi = require("./api/discussionsApi");
const studySessionsApi = require("./api/studySessionsApi");

beforeEach(() => {
  coursesApi.fetchCourses.mockResolvedValue(JSON.parse(JSON.stringify(MOCK_COURSES)));
  eventsApi.fetchEvents.mockResolvedValue(JSON.parse(JSON.stringify(MOCK_EVENTS)));
  quizzesApi.fetchQuizzes.mockResolvedValue(JSON.parse(JSON.stringify(MOCK_QUIZZES)));
  recordingsApi.fetchRecordings.mockResolvedValue(JSON.parse(JSON.stringify(MOCK_RECORDINGS)));
  quizResultsApi.fetchQuizResults.mockResolvedValue(JSON.parse(JSON.stringify(MOCK_RESULTS)));
  studySessionsApi.fetchStudySessions.mockResolvedValue([]);
  discussionsApi.fetchDiscussions.mockResolvedValue([]);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("App component", () => {

  test("clicking a calendar day opens modal with events (large component still works)", async () => {
    render(<App />);

    await waitFor(() => expect(screen.getByText(/My Courses/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /📅 Calendar/i }));

    const day = await screen.findByText("10");
    fireEvent.click(day);

    expect(await screen.findByText(/Events for/i)).toBeInTheDocument();
  });

  test("month navigation buttons update calendar display correctly (MonthNavigation component works)", async () => {
    render(<App />);

    await waitFor(() => expect(screen.getByText(/My Courses/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /📅 Calendar/i }));

    const initialMonthText = await screen.findByText(/April 2026/i);
    expect(initialMonthText).toBeInTheDocument();

    const nextButton = screen.getByRole("button", { name: /Next →/i });
    fireEvent.click(nextButton);

    expect(await screen.findByText(/May 2026/i)).toBeInTheDocument();

    fireEvent.click(nextButton);

    expect(await screen.findByText(/June 2026/i)).toBeInTheDocument();

    const prevButton = screen.getByRole("button", { name: /← Previous/i });
    fireEvent.click(prevButton);

    expect(await screen.findByText(/May 2026/i)).toBeInTheDocument();
  });

  test("defaults to student view and displays calendar", async () => {
    render(<App />);

    await waitFor(() => expect(screen.getByText(/My Courses/i)).toBeInTheDocument());
    expect(screen.getByRole("button", { name: /📅 Calendar/i })).toBeInTheDocument();
    expect(screen.getByText(/4 courses/i)).toBeInTheDocument();
  });

  test("teacher can switch role and add a new course", async () => {
    const createdCourse = {
      id: "c5", name: "Test Automation", code: "AUTO101", teacher: "Dr. Smith",
      color: "#6366f1", schedule: "Fri 4:00 PM", meetLink: "https://meet.google.com/test-123",
      students: 0, announcements: [], files: [],
    };
    coursesApi.createCourse.mockResolvedValue(createdCourse);

    render(<App />);

    await waitFor(() => expect(screen.getByText(/My Courses/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /👩‍🏫 Teacher/i }));

    expect(screen.getByText(/My Classes/i)).toBeInTheDocument();
    expect(screen.getByText(/4 courses/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /\+ New Course/i }));

    const nameInput = screen.getByPlaceholderText(/e\.g\. Intro to Biology/i);
    const codeInput = screen.getByPlaceholderText(/e\.g\. BIO101/i);
    const scheduleInput = screen.getByPlaceholderText(/e\.g\. Mon\/Wed 2:00 PM/i);
    const meetLinkInput = screen.getByPlaceholderText(/https:\/\/meet\.google\.com\/.\./i);

    fireEvent.change(nameInput, { target: { value: "Test Automation" } });
    fireEvent.change(codeInput, { target: { value: "AUTO101" } });
    fireEvent.change(scheduleInput, { target: { value: "Fri 4:00 PM" } });
    fireEvent.change(meetLinkInput, { target: { value: "https://meet.google.com/test-123" } });

    fireEvent.click(screen.getByRole("button", { name: /Create Course/i }));

    expect(await screen.findByText(/5 courses/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Automation/i)).toBeInTheDocument();
  });

  test("teacher can create and launch a quiz on selected course", async () => {
    const createdQuiz = {
      id: "q3", courseId: "c1", title: "React Fundamentals Quiz", status: "inactive",
      currentQuestionIndex: 0,
      questions: [{ id: "qu6", text: "What does React use to describe UI?", options: ["JSX", "CSS", "HTML", "SQL"], correctIndex: 0, topics: [] }],
    };
    const launchedQuiz = { ...createdQuiz, status: "active", currentQuestionIndex: 0 };
    const endedQuiz = { ...launchedQuiz, status: "finished" };

    quizzesApi.createQuiz.mockResolvedValue(createdQuiz);
    quizzesApi.launchQuiz.mockResolvedValue(launchedQuiz);
    quizzesApi.endQuiz.mockResolvedValue(endedQuiz);

    render(<App />);

    await waitFor(() => expect(screen.getByText(/My Courses/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /👩‍🏫 Teacher/i }));

    const firstCourseCard = screen
      .getByText(/Intro to Computer Science/i)
      .closest("div");
    expect(firstCourseCard).toBeInTheDocument();
    fireEvent.click(firstCourseCard);

    fireEvent.click(screen.getByRole("button", { name: /\+ Create Quiz/i }));

    fireEvent.change(screen.getByPlaceholderText(/Quiz title\.{3}/i), {
      target: { value: "React Fundamentals Quiz" },
    });

    fireEvent.change(screen.getByPlaceholderText(/Enter question\.{3}/i), {
      target: { value: "What does React use to describe UI?" },
    });

    const optionInputs = screen.getAllByPlaceholderText(/Option [A-D]/i);
    fireEvent.change(optionInputs[0], { target: { value: "JSX" } });
    fireEvent.change(optionInputs[1], { target: { value: "CSS" } });
    fireEvent.change(optionInputs[2], { target: { value: "HTML" } });
    fireEvent.change(optionInputs[3], { target: { value: "SQL" } });

    fireEvent.click(screen.getByRole("button", { name: /Save Quiz/i }));

    expect(
      await screen.findByText(/React Fundamentals Quiz/i)
    ).toBeInTheDocument();

    const quizItem = screen
      .getByText(/React Fundamentals Quiz/i)
      .closest(".quiz-list-item");

    const launchButton = within(quizItem).getByRole("button", {
      name: /Launch/i,
    });

    expect(launchButton).toBeInTheDocument();

    fireEvent.click(launchButton);

    expect(
      await screen.findByText(/Live Quiz: React Fundamentals Quiz/i)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /End Quiz/i }));

    expect(
      await screen.findByText(/Finished/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Review/i })
    ).toBeInTheDocument();
  });

  // ===== Recordings Repository Tests =====

  test("student sees Recordings button in header", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText(/My Courses/i)).toBeInTheDocument());
    expect(screen.getByRole("button", { name: /🎥 Recordings/i })).toBeInTheDocument();
  });

  test("teacher does NOT see Recordings button", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText(/My Courses/i)).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /👩‍🏫 Teacher/i }));
    expect(screen.queryByRole("button", { name: /🎥 Recordings/i })).not.toBeInTheDocument();
  });

  test("clicking Recordings shows the repository page with recording count", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText(/My Courses/i)).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /🎥 Recordings/i }));
    expect(screen.getByText(/Recordings Repository/i)).toBeInTheDocument();
    expect(screen.getByText(/8 recordings across 4 courses/i)).toBeInTheDocument();
  });

  test("recordings from multiple courses are displayed", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText(/My Courses/i)).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /🎥 Recordings/i }));
    expect(screen.getByText(/Intro to Algorithms/i)).toBeInTheDocument();
    expect(screen.getByText(/Integration by Parts/i)).toBeInTheDocument();
    expect(screen.getByText(/The French Revolution/i)).toBeInTheDocument();
    expect(screen.getByText(/Stereochemistry/i)).toBeInTheDocument();
  });

  test("search filters recordings by title", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText(/My Courses/i)).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /🎥 Recordings/i }));
    const searchInput = screen.getByPlaceholderText(/Search recordings/i);
    fireEvent.change(searchInput, { target: { value: "Taylor" } });
    expect(screen.getByText(/Taylor Series Expansion/i)).toBeInTheDocument();
    expect(screen.queryByText(/Intro to Algorithms/i)).not.toBeInTheDocument();
  });

  test("course filter dropdown limits to selected course", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText(/My Courses/i)).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /🎥 Recordings/i }));
    const filterSelect = screen.getByDisplayValue(/All Courses/i);
    fireEvent.change(filterSelect, { target: { value: "c1" } });
    expect(screen.getByText(/Intro to Algorithms/i)).toBeInTheDocument();
    expect(screen.getByText(/Data Structures/i)).toBeInTheDocument();
    expect(screen.queryByText(/Integration by Parts/i)).not.toBeInTheDocument();
  });

  test("each recording card shows its course name", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText(/My Courses/i)).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /🎥 Recordings/i }));
    const tags = screen.getAllByText(/CS101 – Intro to Computer Science/i);
    expect(tags.length).toBeGreaterThanOrEqual(1);
    const courseTags = tags.filter((el) => el.classList.contains("recording-course-tag"));
    expect(courseTags.length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/MATH201 – Calculus II/i).length).toBeGreaterThanOrEqual(1);
  });

  test("watch buttons have correct link attributes", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText(/My Courses/i)).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /🎥 Recordings/i }));
    const watchLinks = screen.getAllByText("Watch");
    watchLinks.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link).toHaveAttribute("href");
    });
  });

  test("no-match message for empty search results", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText(/My Courses/i)).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /🎥 Recordings/i }));
    const searchInput = screen.getByPlaceholderText(/Search recordings/i);
    fireEvent.change(searchInput, { target: { value: "xyznonexistent" } });
    expect(screen.getByText(/No recordings match your search/i)).toBeInTheDocument();
  });

  test("clicking Calendar while in Recordings switches views", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText(/My Courses/i)).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /🎥 Recordings/i }));
    expect(screen.getByText(/Recordings Repository/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /📅 Calendar/i }));
    expect(screen.queryByText(/Recordings Repository/i)).not.toBeInTheDocument();
    expect(screen.getByText(/📌 Upcoming Events/i)).toBeInTheDocument();
  });
});
