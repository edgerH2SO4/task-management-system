export const getAuthToken = () => {
    return localStorage.getItem('token');
  };
  
  export const setAuthToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  export const removeAuthToken = () => {
    localStorage.removeItem('token');
  };
  
  export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };
  
  export const setCurrentUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  };
  
  export const removeCurrentUser = () => {
    localStorage.removeItem('user');
  };
  
  export const isAuthenticated = () => {
    return !!getAuthToken();
  };