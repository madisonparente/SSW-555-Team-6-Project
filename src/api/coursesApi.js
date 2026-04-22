import { get, post, del } from './client';

export const fetchCourses = () => get('/courses');
export const createCourse = (data) => post('/courses', data);
export const fetchCourse = (id) => get(`/courses/${id}`);
export const addAnnouncement = (courseId, text) => post(`/courses/${courseId}/announcements`, { text });
export const deleteAnnouncement = (courseId, annId) => del(`/courses/${courseId}/announcements/${annId}`);
export const addFiles = (courseId, files) => post(`/courses/${courseId}/files`, { files });
