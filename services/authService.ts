import api from "./api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from "expo-secure-store";

// Constants
const TOKEN_KEY = "jwt";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
}

export interface UserDTO {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface UserSummaryDto {
  userId: number;
  firstName: string;
  lastName: string;
  careerTotalScore: number;
}

const getAllStudents = async (): Promise<UserSummaryDto[]> => {
  const response = await api.get("/user/getAllUserScore");
  return response.data;
};

// Add missing register function
const register = async (user: {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  role: string;
}): Promise<UserDTO> => {
  try {
    const response = await api.post("/user/register", user);
    return response.data;
  } catch (error: any) {
    let message = "Registration failed";

    if (error.response) {
      message = error.response.data || `Server error: ${error.response.status}`;
    } else if (error.message) {
      message = error.message;
    }

    throw new Error(message);
  }
};

// Add missing getCurrentUser function
const getCurrentUser = async (): Promise<UserDTO> => {
  try {
    const response = await api.get("/user/current-user");
    return response.data;
  } catch (error: any) {
    throw new Error("Failed to fetch current user");
  }
};

// Update login function to match
// In your login function
const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post("/user/login", credentials);

    if (!response.data?.token) {
      throw new Error("Authentication token missing in response");
    }

    // Store token in both places to ensure it's available
    const token = response.data.token;
    await AsyncStorage.setItem('authToken', token);
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    
    // Set the token in axios defaults for immediate use
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    console.log("Token stored successfully");
    return response.data;
  } catch (error: any) {
    let message = "Login failed";

    if (error.response) {
      message =
        error.response.data?.message ||
        `Server error: ${error.response.status}`;
    } else if (error.request) {
      message = `No response from server at ${api.defaults.baseURL}`;
    }

    throw new Error(message);
  }
};

export interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password?: string;
}

// Fix getUserProfile to use the correct endpoint
const getUserProfile = async (): Promise<UserProfileData> => {
  try {
    // The endpoint should match exactly what the backend expects
    const response = await api.get('/user/current-user');
    
    // If the response structure is different, transform it to match UserProfileData
    const userData = response.data;
    return {
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      username: userData.username || '',
      password: ''
    };
  } catch (error: any) {
    console.error("Profile fetch error details:", error?.response?.data);
    throw error;
  }
};

// Fix updateUserProfile to use the correct endpoint
const updateUserProfile = async (userData: UserProfileData): Promise<UserProfileData> => {
  try {
    // The endpoint should match exactly what the backend expects
    const response = await api.put('/user/update-profile', userData);
    return response.data;
  } catch (error: any) {
    console.error("Profile update error details:", error?.response?.data);
    throw error;
  }
};

const authService = {
  register,
  login,
  getCurrentUser,
  getAllStudents,
  getUserProfile,
  updateUserProfile,
};

export default authService;
