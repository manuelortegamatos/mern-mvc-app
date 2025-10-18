const API_URL = 'http://localhost:5000/api/tasks';

export const getTasks = async () => {
  const res = await fetch(API_URL);
  return await res.json();
};