import axios from "axios";

const apiBaseURL = "https://hackathon-host.up.railway.app/api/";

const api = axios.create({
  baseURL: apiBaseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  function (response) {
    return response;
  },

  function (error) {
    // Check if the error is due to an invalid or expired token
    if (error.response.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        // Redirect the user to the sign-in page if there's no refresh token
        localStorage.removeItem("access_token");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // Try to refresh the access token using the refresh token
      return axios
        .post(`${apiBaseURL}/auth/token/refresh/`, { refresh: refreshToken })
        .then((response) => {
          // Update the access token in local storage
          localStorage.setItem("access_token", response.data.access);
          // Retry the original request with the new access token
          const config = error.config;
          config.headers["Authorization"] = `Bearer ${response.data.access}`;
          return axios.request(config);
        })
        .catch((error) => {
          // Redirect the user to the sign-in page if the refresh token is invalid
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
          return Promise.reject(error);
        });
    }
    return Promise.reject(error);
  }
);

export const apiWithoutToken = axios.create({
  baseURL: apiBaseURL,
});


export default api;
