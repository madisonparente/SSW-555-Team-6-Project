import { get, post } from './client';

export const fetchQuizResults = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return get(`/quiz-results${query ? `?${query}` : ''}`);
};
export const createQuizResult = (data) => post('/quiz-results', data);
