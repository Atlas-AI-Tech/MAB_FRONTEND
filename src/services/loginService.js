import apiClient from "./apiClient";

export const loginUserInServer = async (username, password) => {
  try {
    const response = await apiClient.post("/login", {
      phone_number: username,
      password: password,
    });
    return response;
  } catch (error) {
    return error;
  }
};
