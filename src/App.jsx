import { useState } from "react";
import Header from "./components/Header";
import CourseCard from "./components/CourseCard";
import CourseDetail from "./components/CourseDetail";
import INITIAL_COURSES from "./data/courses";
import "./App.css";

export default function App() {
  const [role, setRole] = useState("student");
  const [courses] = useState(INITIAL_COURSES);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const totalAnnouncements = courses.reduce(
    (sum, c) => sum + c.announcements.length,
    0,
  );

  if (selectedCourse) {
    const c = courses.find((x) => x.id === selectedCourse);
    if (!c) {
      setSelectedCourse(null);
      return null;
    }
    return (
      <CourseDetail
        course={c}
        role={role}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

  return (
    <div>
      <Header role={role} setRole={setRole} />
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
        </div>
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
