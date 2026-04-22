import { get, post } from './client';

export const fetchRecordings = () => get('/recordings');
export const createRecording = (data) => post('/recordings', data);
