import axios from 'axios';
const baseURL = process.env.REACT_APP_API;

export const getTokenFromLocalStorage = () => {
  return localStorage.getItem("access_token");
}

export const removeAllFromLocalStorage = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("username");
}

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('username');
  localStorage.removeItem('isAuthenticated');
  window.location.href = '/login';
};


export const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${baseURL}/token/custom/`, { username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('username', username);
      localStorage.setItem('user_id', response.data.user_id.toString());
      localStorage.setItem('isAuthenticated', 'true');
      window.location.href = '/';
      return response;
    } catch (error) {
      console.log('Login error', error);

    }
  };