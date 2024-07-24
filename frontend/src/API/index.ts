import axios from "axios";
import { clearTokenFromLocalStorage, getTokenFromLocalStorage } from "../hooks/localStorage";

export const UNAUTHORIZED_STATUS_CODE = 401;
export const FORBIDDEN_STATUS_CODE = 403;

const baseURL = process.env.REACT_APP_API;

export const api = axios.create({
  baseURL,
  headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.status === FORBIDDEN_STATUS_CODE ||
      error.status === UNAUTHORIZED_STATUS_CODE
    ) {
      clearTokenFromLocalStorage();
      window.location.href = "";
    }

    return Promise.reject(error);
  }
);
