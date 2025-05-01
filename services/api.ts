import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "https://elementopia.onrender.com/api"; // Changed to backend port
const TOKEN_KEY = "jwt";

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // Increased timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Updated interceptor to check both storage methods
api.interceptors.request.use(
  async (config) => {
    try {
      // Try AsyncStorage first
      let token = await AsyncStorage.getItem('authToken');
      
      // If not found, try SecureStore as fallback
      if (!token) {
        token = await SecureStore.getItemAsync(TOKEN_KEY);
      }
      
      if (token) {
        // Log token for debugging (remove in production)
        console.log("Using token:", token.substring(0, 10) + "...");
        
        // Make sure Authorization header is properly formatted
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.log("No auth token found");
      }
      
      return config;
    } catch (error) {
      console.error("Error retrieving token:", error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
    } else if (error.response?.status === 403) {
      console.error("403 Forbidden Error. Headers:", error.config?.headers);
      console.error("Response data:", error.response?.data);
    }

    return Promise.reject(error);
  }
);

export default api;
