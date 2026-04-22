# Course Portal Web Application

## SSW 555 – Agile Methods

### Stevens Institute of Technology

## Project Overview

This project is a web-based course portal that allows students and instructors to interact with courses, quizzes, recordings, discussions, and more. Based on their role, users see different dashboards and capabilities.

## System Overview

- React single-page application backed by an Express.js REST API and MongoDB database
- Role-based toggle switches between Student and Instructor views
- Frontend communicates with the backend via a dedicated API service layer (`src/api/`)
- All data (courses, events, quizzes, recordings, discussions, study sessions, quiz results) is persisted in MongoDB
- Automated CI/CD pipeline deploys the frontend to GitHub Pages on every push; backend deploys separately

## Student Features

- View upcoming meetings (e.g., Google Meet links)
- View enrolled courses
- Access course materials
- Interactive calendar with event creation and deletion
- Student growth dashboard with quiz scores, attendance tracking, and recommended review materials
- Take live quizzes and view results
- Browse recordings repository with search and course filtering
- Participate in threaded course discussion boards
- Create and join study sessions

## Instructor Features

- View all courses they teach
- Upload course materials
- Manage course resources for students
- Create, launch, advance, and end live quizzes
- Post and delete course announcements
- Add course recordings
- View quiz reports and student performance analytics

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Create React App |
| Backend | Express.js, Node.js |
| Database | MongoDB, Mongoose ODM |
| Testing | Jest, React Testing Library |
| CI/CD | GitHub Actions, GitHub Pages |

## Development Setup

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install

# Seed the database (requires MongoDB running locally)
npm run seed

# Start both frontend and backend concurrently
cd .. && npm run start:dev
```

## Development Approach

This project is developed using Agile methodologies including sprint planning, task division, and version control with Git.

