import api from "./api.js";

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/register", userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Error");
  }
};

export const loginUser = async (userData) => {
    try {
      const response = await api.post("/login", userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Giriş sırasında hata oluştu.");
    }
  };
