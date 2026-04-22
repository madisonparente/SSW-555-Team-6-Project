import { get, post } from './client';

export const fetchDiscussions = (courseId) => get(`/discussions?courseId=${courseId}`);
export const createDiscussion = (data) => post('/discussions', data);
export const addReply = (threadId, data) => post(`/discussions/${threadId}/replies`, data);
