const INITIAL_QUIZZES = [
  {
    id: 1,
    courseId: 1,
    title: "CS101 Midterm Review",
    status: "inactive",
    currentQuestionIndex: 0,
    questions: [
      {
        id: 1,
        text: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        correctIndex: 1,
        topics: ["binary-search", "time-complexity"],
      },
      {
        id: 2,
        text: "Which data structure uses FIFO ordering?",
        options: ["Stack", "Queue", "Tree", "Graph"],
        correctIndex: 1,
        topics: ["queues", "data-structures"],
      },
      {
        id: 3,
        text: "What does CPU stand for?",
        options: [
          "Central Processing Unit",
          "Computer Personal Unit",
          "Central Program Utility",
          "Core Processing Unit",
        ],
        correctIndex: 0,
        topics: ["hardware-basics"],
      },
    ],
  },
  {
    id: 2,
    courseId: 2,
    title: "MATH201 Integration Quiz",
    status: "inactive",
    currentQuestionIndex: 0,
    questions: [
      {
        id: 4,
        text: "What is the integral of 2x?",
        options: ["x²", "x² + C", "2x² + C", "x + C"],
        correctIndex: 1,
        topics: ["integration", "basic-integrals"],
      },
      {
        id: 5,
        text: "Which technique is used for ∫x·eˣ dx?",
        options: [
          "Substitution",
          "Integration by parts",
          "Partial fractions",
          "Trigonometric substitution",
        ],
        correctIndex: 1,
        topics: ["integration-by-parts", "integration-techniques"],
      },
    ],
  },
];

export default INITIAL_QUIZZES;
