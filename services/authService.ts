import api from "./api";

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
const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post("/user/login", credentials);

    if (!response.data?.token) {
      throw new Error("Authentication token missing in response");
    }

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

// Export all methods explicitly
export default {
  register,
  login,
  getCurrentUser,
  getAllStudents,
};
