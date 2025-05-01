import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

const API_URL = "https://elementopia.onrender.com/api"; // Changed to backend port
const TOKEN_KEY = "jwt";

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // Increased timeout
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Token retrieval error:", error);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.message);

    if (error.message === "Network Error") {
      Alert.alert(
        "Connection Issue",
        `Cannot reach server at ${API_URL}\n\nCheck:\n1. Backend is running\n2. Correct IP address\n3. Same WiFi network`
      );
    } else if (error.response?.status === 401) {
      Alert.alert("Session Expired", "Please log in again");
    }

    return Promise.reject(error);
  }
);

export default api;
