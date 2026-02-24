import React, { useState } from "react";
import Header from "./components/Header";
import "./App.css";

export default function App() {
  const [role, setRole] = useState("student");

  return (
    <div>
      <Header role={role} setRole={setRole} />
      <main className="main">
        <div className="page-header">
          <div>
            <h1 className="page-title">
              {role === "student" ? "My Courses" : "My Classes"}
            </h1>
            <p className="page-subtitle">0 courses · 0 announcements</p>
          </div>
        </div>
        <div className="course-grid"></div>
      </main>
    </div>
  );
}
