const results = [];

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
