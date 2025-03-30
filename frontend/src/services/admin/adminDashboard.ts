import axios from "../../config/axios.config";

export const fetchUserCount = async () => {
  try {
    const response = await axios.get("/admin/user-count");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch user count");
  }
};

export const fetchTrainerCount = async () => {
  try {
    const response = await axios.get("/admin/trainer-count");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch trainer count");
  }
};

export const fetchMonthlyRegistrationData = async () => {
  try {
    const response = await axios.get("/admin/monthly-registrations-data");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch monthly registrations data");
  }
};
