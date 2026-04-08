/**
 * Given a quiz, the student's responses, and available recordings,
 * returns recordings whose topics overlap with incorrectly-answered questions.
 * Results are sorted by number of matching topics (descending).
 */
export function getRecommendations(quiz, responses, recordings) {
  const wrongTopics = new Set();
  for (const q of quiz.questions) {
    if (responses[q.id] !== undefined && responses[q.id] !== q.correctIndex) {
      (q.topics || []).forEach((t) => wrongTopics.add(t));
    }
  }
  if (wrongTopics.size === 0) return [];

  const courseRecordings = recordings.filter(
    (r) => r.courseId === quiz.courseId,
  );

  return courseRecordings
    .map((r) => {
      const matchCount = (r.topics || []).filter((t) =>
        wrongTopics.has(t),
      ).length;
      return { ...r, matchCount };
    })
    .filter((r) => r.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount);
}

/**
 * Dashboard variant: given a quiz result object, looks up the quiz and
 * returns recommendations if the score is below the threshold.
 */
export function getRecommendationsForResult(
  result,
  quizzes,
  studentResponses,
  recordings,
  threshold = 70,
) {
  if (result.percentage >= threshold) return [];
  const quiz = quizzes.find((q) => q.id === result.quizId);
  if (!quiz) return [];
  const responses = studentResponses[quiz.id] || {};
  return getRecommendations(quiz, responses, recordings);
}
