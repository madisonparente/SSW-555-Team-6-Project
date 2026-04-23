import { render, screen, fireEvent, within } from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom";

describe("App component", () => {
  // Verifies calendar displays upcoming events correctly, ensuring duplicate logic still works
  /*test("calendar displays upcoming events correctly (duplicate logic still works)", async () => {
  render(<App />);

  // Navigate to calendar
  fireEvent.click(screen.getByRole("button", { name: /📅 Calendar/i }));

  // Expect upcoming section
  expect(await screen.findByText(/Upcoming Events/i)).toBeInTheDocument();
});

// Verifies clicking a calendar day opens the modal with events, ensuring the large component still functions properly
*/test("clicking a calendar day opens modal with events (large component still works)", async () => {
  render(<App />);

  fireEvent.click(screen.getByRole("button", { name: /📅 Calendar/i }));

  // Click any day (example: 10)
  const day = await screen.findByText("10");
  fireEvent.click(day);

  // Modal should appear
  expect(await screen.findByText(/Events for/i)).toBeInTheDocument();
});

  // Verifies filter buttons correctly filter events by type, ensuring the FilterButtons component still works
  /*test("filter buttons correctly filter events by type in calendar (FilterButtons component works)", async () => {
    render(<App />);

    // Navigate to calendar
    fireEvent.click(screen.getByRole("button", { name: /📅 Calendar/i }));

    // Verify upcoming events are shown initially
    expect(await screen.findByText(/Upcoming Events/i)).toBeInTheDocument();

    // Filter by "Classes" - should show only class events
    const classesButton = screen.getByRole("button", { name: /Classes/i });
    fireEvent.click(classesButton);

    // Verify filter is active
    expect(classesButton).toHaveClass("active");

    // Filter by "Deadlines" - should show only deadline events
    const deadlinesButton = screen.getByRole("button", { name: /Deadlines/i });
    fireEvent.click(deadlinesButton);

    // Verify new filter is active
    expect(deadlinesButton).toHaveClass("active");
    expect(classesButton).not.toHaveClass("active");

    // Reset to "All Events"
    const allEventsButton = screen.getByRole("button", { name: /All Events/i });
    fireEvent.click(allEventsButton);

    // Verify all events filter is active
    expect(allEventsButton).toHaveClass("active");
  });

  // Verifies month navigation buttons update the calendar display correctly, ensuring the MonthNavigation component still works
  */test("month navigation buttons update calendar display correctly (MonthNavigation component works)", async () => {
    render(<App />);

    // Navigate to calendar
    fireEvent.click(screen.getByRole("button", { name: /📅 Calendar/i }));

    // Get initial month display
    const initialMonthText = await screen.findByText(/April 2026/i);
    expect(initialMonthText).toBeInTheDocument();

    // Click next month button
    const nextButton = screen.getByRole("button", { name: /Next →/i });
    fireEvent.click(nextButton);

    // Verify month changed to May
    expect(await screen.findByText(/May 2026/i)).toBeInTheDocument();

    // Click next month button again
    fireEvent.click(nextButton);

    // Verify month changed to June
    expect(await screen.findByText(/June 2026/i)).toBeInTheDocument();

    // Click previous month button
    const prevButton = screen.getByRole("button", { name: /← Previous/i });
    fireEvent.click(prevButton);

    // Verify month changed back to May
    expect(await screen.findByText(/May 2026/i)).toBeInTheDocument();
  });

  test("defaults to student view and displays calendar", () => {
    render(<App />);

    expect(screen.getByText(/My Courses/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /📅 Calendar/i })).toBeInTheDocument();
    expect(screen.getByText(/4 courses/i)).toBeInTheDocument();
  });

  test("teacher can switch role and add a new course", async () => {
    render(<App />);

    // Switch to teacher role
    fireEvent.click(screen.getByRole("button", { name: /👩‍🏫 Teacher/i }));

    expect(screen.getByText(/My Classes/i)).toBeInTheDocument();
    expect(screen.getByText(/4 courses/i)).toBeInTheDocument();

    // Open new course form
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
    render(<App />);

    // Switch to teacher role
    fireEvent.click(screen.getByRole("button", { name: /👩‍🏫 Teacher/i }));

    // Open course details
    const firstCourseCard = screen
      .getByText(/Intro to Computer Science/i)
      .closest("div");
    expect(firstCourseCard).toBeInTheDocument();
    fireEvent.click(firstCourseCard);

    // Create a quiz
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

    // Ensure quiz appears
    expect(
      await screen.findByText(/React Fundamentals Quiz/i)
    ).toBeInTheDocument();

    // fix: target the correct "Launch" button
    const quizItem = screen
      .getByText(/React Fundamentals Quiz/i)
      .closest(".quiz-list-item");

    const launchButton = within(quizItem).getByRole("button", {
      name: /Launch/i,
    });

    expect(launchButton).toBeInTheDocument();

    // Launch quiz
    fireEvent.click(launchButton);

    expect(
      await screen.findByText(/Live Quiz: React Fundamentals Quiz/i)
    ).toBeInTheDocument();

    // End quiz
    fireEvent.click(screen.getByRole("button", { name: /End Quiz/i }));

  expect(
    await screen.findByText(/Finished/i)
  ).toBeInTheDocument();

  expect(
    screen.getByRole("button", { name: /Review/i })
  ).toBeInTheDocument();
  });

  // ===== Recordings Repository Tests =====

  test("student sees Recordings button in header", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: /🎥 Recordings/i })).toBeInTheDocument();
  });

  test("teacher does NOT see Recordings button", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /👩‍🏫 Teacher/i }));
    expect(screen.queryByRole("button", { name: /🎥 Recordings/i })).not.toBeInTheDocument();
  });

  test("clicking Recordings shows the repository page with recording count", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /🎥 Recordings/i }));
    expect(screen.getByText(/Recordings Repository/i)).toBeInTheDocument();
    expect(screen.getByText(/8 recordings across 4 courses/i)).toBeInTheDocument();
  });

  test("recordings from multiple courses are displayed", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /🎥 Recordings/i }));
    expect(screen.getByText(/Intro to Algorithms/i)).toBeInTheDocument();
    expect(screen.getByText(/Integration by Parts/i)).toBeInTheDocument();
    expect(screen.getByText(/The French Revolution/i)).toBeInTheDocument();
    expect(screen.getByText(/Stereochemistry/i)).toBeInTheDocument();
  });

  test("search filters recordings by title", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /🎥 Recordings/i }));
    const searchInput = screen.getByPlaceholderText(/Search recordings/i);
    fireEvent.change(searchInput, { target: { value: "Taylor" } });
    expect(screen.getByText(/Taylor Series Expansion/i)).toBeInTheDocument();
    expect(screen.queryByText(/Intro to Algorithms/i)).not.toBeInTheDocument();
  });

  test("course filter dropdown limits to selected course", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /🎥 Recordings/i }));
    const filterSelect = screen.getByDisplayValue(/All Courses/i);
    fireEvent.change(filterSelect, { target: { value: "1" } });
    expect(screen.getByText(/Intro to Algorithms/i)).toBeInTheDocument();
    expect(screen.getByText(/Data Structures/i)).toBeInTheDocument();
    expect(screen.queryByText(/Integration by Parts/i)).not.toBeInTheDocument();
  });

  test("each recording card shows its course name", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /🎥 Recordings/i }));
    const tags = screen.getAllByText(/CS101 – Intro to Computer Science/i);
    expect(tags.length).toBeGreaterThanOrEqual(1);
    const courseTags = tags.filter((el) => el.classList.contains("recording-course-tag"));
    expect(courseTags.length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/MATH201 – Calculus II/i).length).toBeGreaterThanOrEqual(1);
  });

  test("watch buttons have correct link attributes", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /🎥 Recordings/i }));
    const watchLinks = screen.getAllByText("Watch");
    watchLinks.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link).toHaveAttribute("href");
    });
  });

  test("no-match message for empty search results", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /🎥 Recordings/i }));
    const searchInput = screen.getByPlaceholderText(/Search recordings/i);
    fireEvent.change(searchInput, { target: { value: "xyznonexistent" } });
    expect(screen.getByText(/No recordings match your search/i)).toBeInTheDocument();
  });

  test("clicking Calendar while in Recordings switches views", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /🎥 Recordings/i }));
    expect(screen.getByText(/Recordings Repository/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /📅 Calendar/i }));
    expect(screen.queryByText(/Recordings Repository/i)).not.toBeInTheDocument();
    expect(screen.getByText(/📌 Upcoming Events/i)).toBeInTheDocument();
  });
});
