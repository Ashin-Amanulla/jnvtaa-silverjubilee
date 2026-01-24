import axiosInstance from "./axios";

export const createRegistration = async (registrationData) => {
  try {
    const response = await axiosInstance.post(
      `/registrations`,
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
  const response = await axiosInstance.get(`/registrations/search/${query}`);
  return response.data;
};

// Check-in related API functions
export const searchForCheckin = async (email, mobile) => {
  try {
    const params = new URLSearchParams();
    if (email) params.append("email", email);
    if (mobile) params.append("mobile", mobile);
    
    const response = await axiosInstance.get(
      `/registrations/checkin/search?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw {
        message: error.response.data.message || "Search failed",
        status: error.response.status,
      };
    }
    throw {
      message: "Network error. Please check your connection.",
    };
  }
};

export const selfCheckin = async (registrationId) => {
  try {
    const response = await axiosInstance.post(
      `/registrations/checkin/${registrationId}`
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw {
        message: error.response.data.message || "Check-in failed",
        status: error.response.status,
      };
    }
    throw {
      message: "Network error. Please check your connection.",
    };
  }
};

export const verifyRegistrationForCheckin = async (registrationId) => {
  try {
    const response = await axiosInstance.get(
      `/registrations/checkin/verify/${registrationId}`
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw {
        message: error.response.data.message || "Verification failed",
        status: error.response.status,
      };
    }
    throw {
      message: "Network error. Please check your connection.",
    };
  }
};

export const addGuestsToRegistration = async (id, guestsData) => {
  try {
    const response = await axiosInstance.post(
      `/registrations/${id}/add-guests`,
      { guests: guestsData }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw {
        message: error.response.data.message || "Failed to add guests",
        errors: error.response.data.errors || [],
        status: error.response.status,
      };
    }
    throw {
      message: "Network error. Please check your connection.",
    };
  }
};
