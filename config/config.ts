import axios from "axios";
import { updateRefreshToken } from "@/services/AuthService";
import { InfoMessage } from "@/config/types";

// export const BASE_URL = "http://localhost:4001";
// export const CLIENT_URL = "https://wellness.markets";
export const BASE_URL = "https://admin.wellness.markets";
export const CLIENT_URL = "http://localhost:3000";

export const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokens = await updateRefreshToken();

        if (tokens?.newAccessToken) {
          localStorage.setItem("accessToken", tokens.newAccessToken);
          localStorage.setItem("refreshToken", tokens.newRefreshToken);

          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${tokens.newAccessToken}`;
          return api(originalRequest);
        } else {
          localStorage.setItem("accessToken", "");
          localStorage.setItem("refreshToken", "");
        }
      } catch (refreshError) {
        if (axios.isAxiosError(refreshError)) {
          if (
            refreshError.status === 500 ||
            refreshError.code === "ERR_NETWORK"
          ) {
            if (typeof originalRequest.setInfoMessage === "function") {
              originalRequest.setInfoMessage({
                type: "error",
                text: "Ой! Сталася помилка на сервері!",
              });
            }
          }
        }
        console.error("Failed to refresh token", refreshError);
      }
    }

    if (axios.isAxiosError(error)) {
      if (error.status === 500 || error.code === "ERR_NETWORK") {
        if (typeof originalRequest.setInfoMessage === "function") {
          originalRequest.setInfoMessage({
            type: "error",
            text: "Ой! Сталася помилка на сервері!",
          });
        }
      }
    }

    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
