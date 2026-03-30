import api from '../lib/axios';

// Auth API
export const login = (credentials) => api.post('/users/login', credentials);
export const register = (userData) => api.post('/users/register', userData);

// Dashboard
export const getDashboardSummary = () => api.get('/dashboard/summary');

// Tasks API
export const getTasks = () => api.get('/tasks');
export const getTaskById = (id) => api.get(`/tasks/${id}`);
export const getUserTasks = (userId) => api.get(`/tasks/user/${userId}`);
export const createTask = (task) => api.post('/tasks', task);
export const completeTask = (id) => api.put(`/tasks/${id}/complete`);
export const postponeTask = (id) => api.put(`/tasks/${id}/postpone`);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const getOverdueTasks = () => api.get('/tasks/overdue');
export const getTopProcrastinatedTasks = () => api.get('/tasks/top-procrastinated');
export const getProductivityTrend = () => api.get('/tasks/productivity-trend');
export const getProcrastinationScore = () => api.get('/tasks/procrastination-score');
export const getWarnings = () => api.get('/tasks/warnings');
