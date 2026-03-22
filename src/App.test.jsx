import { render, screen, fireEvent, within } from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom";

describe("App component", () => {
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

    // 🔥 FIX: target the correct "Launch" button
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
});
