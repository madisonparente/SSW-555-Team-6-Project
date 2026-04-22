require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Course = require('../models/Course');
const Event = require('../models/Event');
const Quiz = require('../models/Quiz');
const Recording = require('../models/Recording');
const QuizResult = require('../models/QuizResult');

// ── Inline mock data (mirrors src/data/*.js) ──

const COURSES = [
  { _oldId: 1, name: "Intro to Computer Science", code: "CS101", teacher: "Dr. Smith", meetLink: "https://meet.google.com/abc-defg-hij", color: "#6366f1", schedule: "Mon/Wed 10:00 AM", students: 28, announcements: [{ text: "Midterm moved to March 15" }, { text: "Lab 3 due Friday" }], files: [] },
  { _oldId: 2, name: "Calculus II", code: "MATH201", teacher: "Prof. Johnson", meetLink: "https://meet.google.com/klm-nopq-rst", color: "#ec4899", schedule: "Tue/Thu 1:00 PM", students: 35, announcements: [{ text: "Chapter 7 homework posted" }], files: [] },
  { _oldId: 3, name: "World History", code: "HIST110", teacher: "Dr. Garcia", meetLink: "https://meet.google.com/uvw-xyza-bcd", color: "#f59e0b", schedule: "Mon/Wed/Fri 9:00 AM", students: 42, announcements: [], files: [] },
  { _oldId: 4, name: "Organic Chemistry", code: "CHEM301", teacher: "Prof. Lee", meetLink: "https://meet.google.com/efg-hijk-lmn", color: "#10b981", schedule: "Tue/Thu 3:00 PM", students: 22, announcements: [{ text: "Lab safety quiz Monday" }, { text: "Office hours moved to 4 PM" }], files: [] },
];

const ATTENDED_IDS = [1, 2, 3, 5, 6, 9];

const EVENTS = [
  { _oldId: 1, courseOldId: 1, courseName: "Intro to Computer Science", courseCode: "CS101", type: "class", title: "CS101 - Class Session", date: "2026-03-10", startTime: "10:00 AM", endTime: "11:30 AM", dayOfWeek: "Monday", location: "Online", meetLink: "https://meet.google.com/abc-defg-hij" },
  { _oldId: 2, courseOldId: 1, courseName: "Intro to Computer Science", courseCode: "CS101", type: "class", title: "CS101 - Class Session", date: "2026-03-12", startTime: "10:00 AM", endTime: "11:30 AM", dayOfWeek: "Wednesday", location: "Online", meetLink: "https://meet.google.com/abc-defg-hij" },
  { _oldId: 3, courseOldId: 2, courseName: "Calculus II", courseCode: "MATH201", type: "class", title: "MATH201 - Class Session", date: "2026-03-11", startTime: "1:00 PM", endTime: "2:30 PM", dayOfWeek: "Tuesday", location: "Online", meetLink: "https://meet.google.com/klm-nopq-rst" },
  { _oldId: 4, courseOldId: 2, courseName: "Calculus II", courseCode: "MATH201", type: "class", title: "MATH201 - Class Session", date: "2026-03-13", startTime: "1:00 PM", endTime: "2:30 PM", dayOfWeek: "Thursday", location: "Online", meetLink: "https://meet.google.com/klm-nopq-rst" },
  { _oldId: 5, courseOldId: 3, courseName: "World History", courseCode: "HIST110", type: "class", title: "HIST110 - Class Session", date: "2026-03-10", startTime: "9:00 AM", endTime: "10:30 AM", dayOfWeek: "Monday", location: "Room 205", meetLink: "https://meet.google.com/uvw-xyza-bcd" },
  { _oldId: 6, courseOldId: 3, courseName: "World History", courseCode: "HIST110", type: "class", title: "HIST110 - Class Session", date: "2026-03-12", startTime: "9:00 AM", endTime: "10:30 AM", dayOfWeek: "Wednesday", location: "Room 205", meetLink: "https://meet.google.com/uvw-xyza-bcd" },
  { _oldId: 7, courseOldId: 3, courseName: "World History", courseCode: "HIST110", type: "class", title: "HIST110 - Class Session", date: "2026-03-14", startTime: "9:00 AM", endTime: "10:30 AM", dayOfWeek: "Friday", location: "Room 205", meetLink: "https://meet.google.com/uvw-xyza-bcd" },
  { _oldId: 8, courseOldId: 4, courseName: "Organic Chemistry", courseCode: "CHEM301", type: "class", title: "CHEM301 - Class Session", date: "2026-03-11", startTime: "3:00 PM", endTime: "4:30 PM", dayOfWeek: "Tuesday", location: "Lab 101", meetLink: "https://meet.google.com/efg-hijk-lmn" },
  { _oldId: 9, courseOldId: 4, courseName: "Organic Chemistry", courseCode: "CHEM301", type: "class", title: "CHEM301 - Class Session", date: "2026-03-13", startTime: "3:00 PM", endTime: "4:30 PM", dayOfWeek: "Thursday", location: "Lab 101", meetLink: "https://meet.google.com/efg-hijk-lmn" },
  // Tutoring
  { _oldId: 10, courseOldId: 1, courseName: "Intro to Computer Science", courseCode: "CS101", type: "tutoring", title: "CS101 - Tutoring Session", date: "2026-03-15", startTime: "2:00 PM", endTime: "3:00 PM", dayOfWeek: "Saturday", location: "Library - Room 103", instructor: "TA John" },
  { _oldId: 11, courseOldId: 2, courseName: "Calculus II", courseCode: "MATH201", type: "tutoring", title: "MATH201 - Tutoring Session", date: "2026-03-12", startTime: "4:00 PM", endTime: "5:00 PM", dayOfWeek: "Wednesday", location: "Student Center", instructor: "TA Maria" },
  { _oldId: 12, courseOldId: 4, courseName: "Organic Chemistry", courseCode: "CHEM301", type: "tutoring", title: "CHEM301 - Tutoring Session", date: "2026-03-16", startTime: "1:00 PM", endTime: "2:30 PM", dayOfWeek: "Sunday", location: "Science Building - Room 215", instructor: "TA Alex" },
  // Deadlines
  { _oldId: 13, courseOldId: 1, courseName: "Intro to Computer Science", courseCode: "CS101", type: "deadline", title: "CS101 - Programming Assignment 2 Due", date: "2026-03-14", dueTime: "11:59 PM", description: "Submit via GitHub" },
  { _oldId: 14, courseOldId: 1, courseName: "Intro to Computer Science", courseCode: "CS101", type: "deadline", title: "CS101 - Lab 3 Report Due", date: "2026-03-15", dueTime: "5:00 PM", description: "Submission on Canvas" },
  { _oldId: 15, courseOldId: 2, courseName: "Calculus II", courseCode: "MATH201", type: "deadline", title: "MATH201 - Chapter 7 Homework Due", date: "2026-03-12", dueTime: "11:59 PM", description: "WebAssign submission" },
  { _oldId: 16, courseOldId: 2, courseName: "Calculus II", courseCode: "MATH201", type: "deadline", title: "MATH201 - Midterm Exam", date: "2026-03-20", dueTime: "10:00 AM", description: "In-person exam" },
  { _oldId: 17, courseOldId: 3, courseName: "World History", courseCode: "HIST110", type: "deadline", title: "HIST110 - Research Paper Due", date: "2026-03-17", dueTime: "11:59 PM", description: "5 pages, uploaded to Canvas" },
  { _oldId: 18, courseOldId: 4, courseName: "Organic Chemistry", courseCode: "CHEM301", type: "deadline", title: "CHEM301 - Lab Report Due", date: "2026-03-16", dueTime: "3:00 PM", description: "Hardcopy and digital submission" },
  { _oldId: 19, courseOldId: 4, courseName: "Organic Chemistry", courseCode: "CHEM301", type: "deadline", title: "CHEM301 - Problem Set 5 Due", date: "2026-03-18", dueTime: "11:59 PM", description: "Canvas submission" },
];

const QUIZZES = [
  {
    _oldId: 1, courseOldId: 1, title: "CS101 Midterm Review", status: "inactive", currentQuestionIndex: 0,
    questions: [
      { text: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], correctIndex: 1, topics: ["binary-search", "time-complexity"] },
      { text: "Which data structure uses FIFO ordering?", options: ["Stack", "Queue", "Tree", "Graph"], correctIndex: 1, topics: ["queues", "data-structures"] },
      { text: "What does CPU stand for?", options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Processing Unit"], correctIndex: 0, topics: ["hardware-basics"] },
    ],
  },
  {
    _oldId: 2, courseOldId: 2, title: "MATH201 Integration Quiz", status: "inactive", currentQuestionIndex: 0,
    questions: [
      { text: "What is the integral of 2x?", options: ["x²", "x² + C", "2x² + C", "x + C"], correctIndex: 1, topics: ["integration", "basic-integrals"] },
      { text: "Which technique is used for ∫x·eˣ dx?", options: ["Substitution", "Integration by parts", "Partial fractions", "Trigonometric substitution"], correctIndex: 1, topics: ["integration-by-parts", "integration-techniques"] },
    ],
  },
];

const RECORDINGS = [
  { _oldId: 1, courseOldId: 1, title: "Intro to Algorithms & Big-O Notation", date: "2025-03-10", duration: "52 min", videoUrl: "https://www.youtube.com/watch?v=example1", description: "Covers time complexity basics, Big-O, Big-Theta, and common algorithm patterns.", topics: ["time-complexity", "algorithms"] },
  { _oldId: 2, courseOldId: 1, title: "Data Structures: Linked Lists & Stacks", date: "2025-03-12", duration: "48 min", videoUrl: "https://www.youtube.com/watch?v=example2", description: "Walkthrough of linked list operations, stack implementation, and use-cases.", topics: ["data-structures", "queues"] },
  { _oldId: 3, courseOldId: 2, title: "Integration by Parts", date: "2025-03-11", duration: "55 min", videoUrl: "https://www.youtube.com/watch?v=example3", description: "Detailed examples of integration by parts with practice problems.", topics: ["integration-by-parts", "integration-techniques", "integration"] },
  { _oldId: 4, courseOldId: 2, title: "Taylor Series Expansion", date: "2025-03-14", duration: "60 min", videoUrl: "https://www.youtube.com/watch?v=example4", description: "Deriving Taylor and Maclaurin series, convergence tests, and applications.", topics: ["taylor-series"] },
  { _oldId: 5, courseOldId: 3, title: "The French Revolution – Causes & Key Events", date: "2025-03-09", duration: "45 min", videoUrl: "https://www.youtube.com/watch?v=example5", description: "Overview of the social, economic, and political causes leading to the Revolution.", topics: ["french-revolution", "political-history"] },
  { _oldId: 6, courseOldId: 3, title: "Industrial Revolution & Its Global Impact", date: "2025-03-13", duration: "50 min", videoUrl: "https://www.youtube.com/watch?v=example6", description: "Technological advances, factory systems, and worldwide socioeconomic changes.", topics: ["industrial-revolution", "economic-history"] },
  { _oldId: 7, courseOldId: 4, title: "Stereochemistry & Chirality", date: "2025-03-10", duration: "58 min", videoUrl: "https://www.youtube.com/watch?v=example7", description: "R/S configuration, enantiomers, diastereomers, and optical activity.", topics: ["stereochemistry", "chirality"] },
  { _oldId: 8, courseOldId: 4, title: "Nucleophilic Substitution Reactions (SN1 & SN2)", date: "2025-03-14", duration: "63 min", videoUrl: "https://www.youtube.com/watch?v=example8", description: "Mechanism comparison, kinetics, stereochemical outcomes, and solvent effects.", topics: ["nucleophilic-substitution", "reaction-mechanisms"] },
];

// Generate Dr. Smith office hours for March 2026
function generateDrSmithOfficeHours(month, year) {
  const hours = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dow = date.getDay();
    if ([1, 3, 5].includes(dow)) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      hours.push({
        courseOldId: null,
        courseName: "Office Hours",
        courseCode: "OFFICE",
        type: "office-hours",
        title: "Office Hours - Dr. Smith",
        date: dateString,
        startTime: "3:00 PM",
        endTime: "6:00 PM",
        location: "Room 302 / Zoom",
        instructor: "Dr. Smith",
        meetLink: "https://calendly.com/dr-smith/office-hours",
        description: "Schedule a time block for project review or course questions.",
      });
    }
  }
  return hours;
}

const RESULTS = [
  { _oldQuizId: 1, studentId: 1, title: "CS101 Midterm Review", score: 8, total: 10, percentage: 80 },
  { _oldQuizId: 2, studentId: 1, title: "MATH201 Integration Quiz", score: 6, total: 8, percentage: 75 },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    Course.deleteMany({}),
    Event.deleteMany({}),
    Quiz.deleteMany({}),
    Recording.deleteMany({}),
    QuizResult.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  // Insert courses and build ID map
  const courseIdMap = {}; // oldId -> new ObjectId
  for (const c of COURSES) {
    const { _oldId, ...data } = c;
    const doc = await Course.create(data);
    courseIdMap[_oldId] = doc._id;
  }
  console.log(`Seeded ${Object.keys(courseIdMap).length} courses`);

  // Insert events with mapped courseIds
  const allEvents = [...EVENTS, ...generateDrSmithOfficeHours(2, 2026)];
  const eventDocs = [];
  for (const e of allEvents) {
    const { _oldId, courseOldId, ...data } = e;
    data.courseId = courseOldId ? courseIdMap[courseOldId] : null;
    data.attended = _oldId ? ATTENDED_IDS.includes(_oldId) : false;
    eventDocs.push(data);
  }
  await Event.insertMany(eventDocs);
  console.log(`Seeded ${eventDocs.length} events`);

  // Insert quizzes with mapped courseIds
  const quizIdMap = {}; // oldId -> new ObjectId
  for (const q of QUIZZES) {
    const { _oldId, courseOldId, ...data } = q;
    data.courseId = courseIdMap[courseOldId];
    const doc = await Quiz.create(data);
    quizIdMap[_oldId] = doc._id;
  }
  console.log(`Seeded ${Object.keys(quizIdMap).length} quizzes`);

  // Insert recordings with mapped courseIds
  const recDocs = RECORDINGS.map(r => {
    const { _oldId, courseOldId, ...data } = r;
    data.courseId = courseIdMap[courseOldId];
    return data;
  });
  await Recording.insertMany(recDocs);
  console.log(`Seeded ${recDocs.length} recordings`);

  // Insert quiz results with mapped quizIds
  const resultDocs = RESULTS.map(r => {
    const { _oldQuizId, ...data } = r;
    data.quizId = quizIdMap[_oldQuizId];
    return data;
  });
  await QuizResult.insertMany(resultDocs);
  console.log(`Seeded ${resultDocs.length} quiz results`);

  console.log('Seed complete!');
  await mongoose.connection.close();
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
