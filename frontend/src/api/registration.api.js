import axios from "axios";
import axiosInstance from "./axios";

// backend api url
const API_URL =
  import.meta.env.VITE_API_URL || "https://api-btth.jnvcan.com/api";

export const createRegistration = async (registrationData) => {
  try {
    const response = await axios.post(
      `${API_URL}/registrations`,
      registrationData
    );
    return response.data;
  } catch (error) {
    // Extract error details from backend response
    if (error.response) {
      // Backend returned an error response
      const errorData = error.response.data;
      throw {
        message: errorData.message || "Registration failed",
        errors: errorData.errors || [],
        status: error.response.status,
        data: errorData,
      };
    } else if (error.request) {
      // Request was made but no response received
      throw {
        message: "Network error. Please check your connection and try again.",
        errors: [],
      };
    } else {
      // Something else happened
      throw {
        message: error.message || "An unexpected error occurred",
        errors: [],
      };
    }
  }
};

export const getRegistrations = async (params) => {
  try {
    const response = await axiosInstance.get(`/registrations?${params}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching registrations", error);
    throw new Error("Failed to fetch registrations");
  }
};

export const getRegistrationStats = async () => {
  const response = await axiosInstance.get(`/registrations/stats/summary`);
  return response.data;
};

export const downloadRegistrations = async () => {
  const response = await axiosInstance.get(`/registrations/download`, {
    responseType: "blob",
  });
  return response;
};

export const updateRegistration = async (id, registrationData) => {
  const response = await axiosInstance.put(
    `/registrations/${id}`,
    registrationData
  );
  return response.data;
};

export const getRegistration = async (id) => {
  const response = await axiosInstance.get(`/registrations/${id}`);
  return response.data;
};

export const searchRegistration = async (query) => {
  const response = await axios.get(`${API_URL}/registrations/search/${query}`);
  return response.data;
};
