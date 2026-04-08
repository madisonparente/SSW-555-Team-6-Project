import resources from "../data/resources";

export const getRecommendations = (quiz, responses) => {
  const weakTopics = new Set();

  quiz.questions.forEach((q) => {
    if (responses[q.id] !== q.correctIndex) {
      weakTopics.add(q.topic);
    }
  });

  const recommendations = [];

  weakTopics.forEach((topic) => {
    if (resources[topic]) {
      recommendations.push({
        topic,
        materials: resources[topic],
      });
    }
  });

  return recommendations;
};
