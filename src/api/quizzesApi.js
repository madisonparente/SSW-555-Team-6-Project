import { get, post, patch } from './client';

export const fetchQuizzes = () => get('/quizzes');
export const createQuiz = (data) => post('/quizzes', data);
export const launchQuiz = (id) => patch(`/quizzes/${id}/launch`);
export const advanceQuiz = (id) => patch(`/quizzes/${id}/advance`);
export const endQuiz = (id) => patch(`/quizzes/${id}/end`);
