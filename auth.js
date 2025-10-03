// Auth utilities for token and role management
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

export const setUserRole = (role) => {
  localStorage.setItem('userRole', role);
};

export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

export const removeUserRole = () => {
  localStorage.removeItem('userRole');
};

export function authHeader() {
  const token = getAuthToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}
