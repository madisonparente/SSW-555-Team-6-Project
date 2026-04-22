import { get, post } from './client';

export const fetchStudySessions = () => get('/study-sessions');
export const createStudySession = (data) => post('/study-sessions', data);
