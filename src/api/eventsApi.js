import { get, post, del } from './client';

export const fetchEvents = () => get('/events');
export const createEvent = (data) => post('/events', data);
export const deleteEvent = (id) => del(`/events/${id}`);
