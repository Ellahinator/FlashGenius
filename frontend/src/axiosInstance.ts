import axios from "axios";
import { getCookie, removeCookie, setCookie } from "typescript-cookie";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/",
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true;
      const refreshToken = getCookie("refresh_token");

      if (!refreshToken) {
        // Handle case where there is no refresh token
        window.dispatchEvent(new Event("unauthorized"));
        return Promise.reject(error);
      }

      try {
        const tokenResponse = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          {
            refresh: refreshToken,
          }
        );
        // Update the JWT token in cookies
        setCookie("jwt_token", tokenResponse.data.access, { path: "/" });
        originalRequest.headers["Authorization"] =
          "Bearer " + tokenResponse.data.access;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure
        console.error("Token refresh failed:", refreshError);
        removeCookie("jwt_token");
        removeCookie("refresh_token");
        window.dispatchEvent(new Event("unauthorized"));
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
