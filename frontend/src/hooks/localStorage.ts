
export const setDataToLocalStorage = (data: any) => {
  localStorage.setItem("token", data.access_token);
  localStorage.setItem("userId", data.id);
};

export const getTokenFromLocalStorage = (): string | null => {
  return localStorage.getItem("token");
};

export const clearTokenFromLocalStorage = () => {
  localStorage.removeItem("token");
};