const results = [
  {
    studentId: 1,
    quizId: 1,
    title: "CS101 Midterm Review",
    score: 8,
    total: 10,
    percentage: 80,
  },
  {
    studentId: 1,
    quizId: 2,
    title: "MATH201 Integration Quiz",
    score: 6,
    total: 8,
    percentage: 75,
  },
];

export const saveQuizResult = (result) => {
  results.push(result);
};

export const getResultsByQuiz = (quizId) => {
  return results.filter((r) => r.quizId === quizId);
};

export const getResultsByStudent = (studentId) => {
  return results.filter((r) => r.studentId === studentId);
};

export default results;
